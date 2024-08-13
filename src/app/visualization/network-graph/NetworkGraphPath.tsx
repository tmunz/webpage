import React, { forwardRef, useRef, useMemo } from 'react';
import { AdditiveBlending, CatmullRomCurve3, Color, DoubleSide, ShaderMaterial, Vector3 } from 'three';
import { Object3DNode, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { calculateTransformationMatrix } from './NetworkGraphCalculator';

extend({
  PathMaterial: shaderMaterial(
    { time: 0, color: new Color(0.5, 0.5, 0.5), seed: 0, speed: 1.0, wiggleSpeed: 1.0, wiggleAmplitude: 1.0 },
    // vertex shader
    `
      // start GLSL Perlin Noise Function

      float fade(float t) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
      }

      float grad(int hash, float x) {
        int h = hash & 15;
        float grad = 1.0 + float(h & 7);
        if ((h & 8) != 0) grad = -grad; 
        return grad * x;
      }

      float lerp(float t, float a, float b) {
        return a + t * (b - a);
      }

      float noise(float x, float s) {
        int xi = int(floor(x + s * 255.0)) & 255;
        float xf = x - floor(x);
        float u = fade(xf);
        
        int aa = xi;
        int ab = xi + 1;

        float res = lerp(u, grad(aa, xf), grad(ab, xf - 1.0));
        return res;
      }

      float seamlessNoise(float x, float s, float period) {
        float loopedX = mod(x, period);
        float periodFraction = loopedX / period;

        float noiseValue1 = noise(loopedX, s);
        float noiseValue2 = noise(loopedX + 1.0, s);

        float blendFactor = fade(periodFraction);
        float res = lerp(blendFactor, noiseValue1, noiseValue2);

        return res;
      }
      // end GLSL Perlin Noise Function

      varying vec2 vUv;
      varying float vProgress;
      uniform float time;
      uniform float wiggleAmplitude;
      uniform float wiggleSpeed;
      uniform float speed;
      uniform float seed;

      void main() {
        vUv = uv;
        vec3 transformed = position.xyz;
        vProgress = smoothstep(-1.0, 1.0, seamlessNoise(vUv.x - time * speed, seed, 1.0));
        float brightnessLimiter = smoothstep(-0.5, 0.0, position.y) * smoothstep(0.5, 0.0, position.y) * 0.8  + 0.2;
        float brightnessMultiplier = vProgress * 5.0 * brightnessLimiter;
        float wiggleLimiter = smoothstep(-0.5, 0.0, position.y) * smoothstep(0.5, 0.0, position.y);
        float wiggleDisplacementX = seamlessNoise(position.y - time * wiggleSpeed, seed, 1.0) * wiggleLimiter * wiggleAmplitude;
        float wiggleDisplacementZ = seamlessNoise(position.y + 0.5 - time * wiggleSpeed, seed + 0.5, 1.0) * wiggleLimiter * wiggleAmplitude;
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
    { time: 0, color: new Color(1.0, 1.0, 1.0), speed: 1.0, maxOffset: 1.0, circulationDensity: 1.0 },
    // vertex shader
    `
      uniform float time;
      uniform float speed;
      uniform float maxOffset;
      uniform float circulationDensity;
      attribute float size;
      attribute float seed;
      varying float vSize;
      
      
      void main() {
        vec3 newPosition = position;
        newPosition.y = mod(speed * time / size + position.y, 1.0) - 0.5;

        // Spiral movement around the Y-axis
        float angle = sign(seed - 0.5) * circulationDensity * 2.0 * 3.1416 * newPosition.y + seed + time * speed;
        float radius = maxOffset;

        newPosition.x = cos(angle) * radius;
        newPosition.z = sin(angle) * radius;

        vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
        float distance = length(mvPosition.xyz);

        vSize = size / distance * 100.0;
        gl_Position = projectionMatrix * mvPosition;
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pathMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial> & {
        color?: Color, seed?: number, speed?: number, wiggleSpeed?: number, wiggleAmplitude?: number,
      };
      pathParticleMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial> & {
        size?: number, speed?: number, color?: Color, seed?: number, maxOffset?: number, circulationDensity?: number,
      };
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
      <pathMaterial ref={pathMaterialRef} side={DoubleSide} seed={seed} speed={0.4} wiggleSpeed={0.1} wiggleAmplitude={2.0} color={color} />
      <PathParticles amount={10} speed={1.5} color={particleColor} size={5} maxOffset={seed} circulationDensity={1/seed} />
    </mesh>
  );
});


function PathParticles({ amount, speed, color, size, maxOffset, circulationDensity }: { amount: number, size?: number, speed?: number, color?: Color, maxOffset?: number, circulationDensity?: number }) {
  const pathParticleMaterialRef = useRef<ShaderMaterial>(null);

  const [positions, sizes, seeds] = useMemo(() => {
    const ps = [];
    const ss = [];
    const seedArray = [];
    const mo = maxOffset ?? 1.0;
    const maxRadius = (size ?? 1.0) * 0.5;
    for (let i = 0; i < amount; i++) {
      ps.push(Math.random() * mo * 2 - mo, Math.random() - 0.5, Math.random() * mo * 2 - mo); // [any, -0.5 - 0.5, any]
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
        opacity={0.5}
        blending={AdditiveBlending}
        speed={speed}
        color={color}
        maxOffset={maxOffset}
        circulationDensity={circulationDensity}
      />
    </points>
  );
}
