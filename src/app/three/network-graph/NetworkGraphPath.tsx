import React, { forwardRef, useRef, useMemo } from 'react';
import { AdditiveBlending, CatmullRomCurve3, Color, DoubleSide, ShaderMaterial, Vector3 } from 'three';
import { Object3DNode, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { calculateTransformationMatrix, noiseGlsl } from './NetworkGraphCalculator';

extend({
  PathMaterial: shaderMaterial(
    { time: 0, color: new Color(0.5, 0.5, 0.5), speed: 1.0, wiggleSeed: 0, wiggleSpeed: 1.0, wiggleAmplitude: 1.0 },
    // vertex shader
    `
      ${noiseGlsl}

      varying vec2 vUv;
      varying float vProgress;
      uniform float time;
      uniform float wiggleSeed;
      uniform float wiggleSpeed;
      uniform float wiggleAmplitude;

      uniform float speed;


      void main() {
        vUv = uv;
        vec3 transformed = position.xyz;
        vProgress = smoothstep(-1.0, 1.0, seamlessNoise(vUv.x - time * speed, wiggleSeed, 1.0));

        // wiggle
        float wiggleFixedEnds = smoothstep(-0.5, 0.0, position.y) * smoothstep(0.5, 0.0, position.y);
        float wiggleDisplacementX = seamlessNoise(position.y - time * wiggleSpeed, wiggleSeed, 1.0) * wiggleFixedEnds * wiggleAmplitude;
        float wiggleDisplacementZ = seamlessNoise(position.y + 0.5 - time * wiggleSpeed, wiggleSeed + 0.5, 1.0) * wiggleFixedEnds * wiggleAmplitude;
        
        // brightness
        float minThickness = 0.1;
        float maxAmplitude = 0.9;
        float brightnessLimitEnds = smoothstep(-0.5, 0.0, position.y) * smoothstep(0.5, 0.0, position.y) * maxAmplitude  + minThickness;
        float brightnessMultiplier = vProgress * 5.0 * brightnessLimitEnds;
        
        // position
        transformed.x += transformed.x * brightnessMultiplier + wiggleDisplacementX;
        transformed.z += transformed.z * brightnessMultiplier + wiggleDisplacementZ;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    // fragment shader
    `
        varying vec2 vUv;
        varying float vProgress;
        uniform float time;
        uniform vec3 color;
        void main() {
          vec3 finalColor = mix(color, color*4.0, vProgress);
          gl_FragColor.rgba = vec4(finalColor, 1.0);
      }
    `
  ),

  PathParticleMaterial: shaderMaterial(
    { time: 0, color: new Color(1.0, 1.0, 1.0), speed: 1.0, maxOffset: 1.0, circulationDensity: 1.0, maxSize: 1.0, wiggleSeed: 0, wiggleSpeed: 1.0, wiggleAmplitude: 1.0 },
    // vertex shader
    `
      ${noiseGlsl}

      varying vec2 vUv;
      varying float vProgress;
      uniform float time;
      uniform float speed;
      uniform float maxOffset;
      uniform float circulationDensity;
      attribute float size;
      attribute float seed;
      varying float vSize;
      uniform float maxSize;
      uniform float wiggleSeed;
      uniform float wiggleSpeed;
      uniform float wiggleAmplitude;
      
      void main() {
        vUv = uv;
        vec3 transformed = position.xyz;
        transformed.y = mod(speed * time / maxSize * size + position.y, 1.0) - 0.5;

        // wiggle
        vProgress = smoothstep(-1.0, 1.0, seamlessNoise(vUv.x - time * speed, wiggleSeed, 1.0));
        float wiggleFixedEnds = smoothstep(-0.5, 0.0, transformed.y) * smoothstep(0.5, 0.0, transformed.y);
        float wiggleDisplacementX = seamlessNoise(transformed.y - time * wiggleSpeed, wiggleSeed, 1.0) * wiggleFixedEnds * wiggleAmplitude;
        float wiggleDisplacementZ = seamlessNoise(transformed.y + 0.5 - time * wiggleSpeed, wiggleSeed + 0.5, 1.0) * wiggleFixedEnds * wiggleAmplitude;

        // spiral movement around the Y-axis
        float angle = sign(seed - 0.5) * circulationDensity * 2.0 * 3.1416 * transformed.y + seed + time * speed;
        float radius = maxOffset;

        // position
        transformed.x += wiggleDisplacementX + cos(angle) * radius;
        transformed.z += wiggleDisplacementZ + sin(angle) * radius;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);  // mvPosition

        // size
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        float distance = length(mvPosition.xyz);
        vSize = size / distance * 1000.0;
        gl_PointSize = vSize;
        
      }
    `,
    // fragment shader
    `
      uniform float time;
      varying float vSize;
      uniform vec3 color;

      void main() {
        // circular points
        float dist = length(gl_PointCoord - 0.5) * 2.0;
        if (dist > 0.5) { discard; }

        gl_FragColor.rgba = vec4(color, 0.5);
      }
    `
  )
});

interface PathMaterialProps {
  color?: Color,
  speed?: number,
  wiggleSeed?: number,
  wiggleSpeed?: number,
  wiggleAmplitude?: number,
}

interface PathParticleMaterialProps {
  size?: number,
  speed?: number,
  color?: Color,
  maxOffset?: number,
  circulationDensity?: number,
  maxSize?: number,
  wiggleSeed?: number,
  wiggleSpeed?: number,
  wiggleAmplitude?: number,
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pathMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial> & PathMaterialProps
      pathParticleMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial> & PathParticleMaterialProps
    }
  }
}


export const NetworkGraphPath = forwardRef(function NetworkGraphLine({ points, userData }: any, ref: any) {
  const pathMaterialRef = useRef<ShaderMaterial>(null);
  const { current: color } = useRef(new Color(0.2, 0.3, 0.6));
  const { current: particleColor } = useRef(new Color(1.0, 1.0, 1.0));
  const { current: seed } = useRef(Math.random());

  useFrame(({ clock }) => {
    if (pathMaterialRef.current) {
      pathMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(0, -0.5, 0), new Vector3(0, 0.5, 0)]), []);

  return (
    <mesh ref={ref} userData={userData} matrixAutoUpdate={false} matrix={calculateTransformationMatrix(points[0], points[1])}>
      <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
      <pathMaterial
        ref={pathMaterialRef} color={color} side={DoubleSide} speed={0.4}
        wiggleSeed={seed} wiggleSpeed={0.1} wiggleAmplitude={2}
      />
      <PathParticles
        amount={25} speed={0.2} color={particleColor} size={2} maxOffset={1} circulationDensity={5}
        wiggleSeed={seed} wiggleSpeed={0.1} wiggleAmplitude={2}
      />
    </mesh>
  );
});


function PathParticles({ amount, speed, color, size = 1, maxOffset = 0, circulationDensity, wiggleSeed, wiggleSpeed, wiggleAmplitude }: PathParticleMaterialProps & { amount: number }) {
  const pathParticleMaterialRef = useRef<ShaderMaterial>(null);

  const [positions, sizes, seeds] = useMemo(() => {
    const ps = [];
    const ss = [];
    const seedArray = [];
    const maxRadius = size * 0.5;
    for (let i = 0; i < amount; i++) {
      ps.push(Math.random() * maxOffset * 2 - maxOffset, Math.random() - 0.5, Math.random() * maxOffset * 2 - maxOffset); // [any, -0.5 - 0.5, any]
      ss.push(Math.random() * maxRadius + maxRadius);
      seedArray.push(Math.random());
    }
    return [new Float32Array(ps), new Float32Array(ss), new Float32Array(seedArray)];
  }, [amount]);

  useFrame(({ clock }) => {
    if (pathParticleMaterialRef.current) {
      pathParticleMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-size'
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach='attributes-seed'
          count={seeds.length}
          array={seeds}
          itemSize={1}
        />
      </bufferGeometry>
      <pathParticleMaterial
        ref={pathParticleMaterialRef}
        attach='material'
        transparent={true}
        depthWrite={true}
        depthTest={true}
        opacity={1}
        blending={AdditiveBlending}
        speed={speed}
        color={color}
        maxSize={size}
        maxOffset={maxOffset}
        circulationDensity={circulationDensity}
        wiggleSeed={wiggleSeed}
        wiggleSpeed={wiggleSpeed}
        wiggleAmplitude={wiggleAmplitude}
      />
    </points>
  );
}
