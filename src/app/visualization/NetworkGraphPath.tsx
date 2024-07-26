import React, { forwardRef, useRef, useMemo } from 'react';
import { CatmullRomCurve3, Color, DoubleSide, ShaderMaterial, Vector2, Vector3 } from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { calculateTransformationMatrix } from './NetworkGraphCalculator';

const PathMaterial = shaderMaterial(
  { time: 0, color: new Color(0.2, 0.4, 0.1) },
  `
  varying vec2 vUv;
  varying float vProgress;
  uniform float time;
  void main() {
    vUv = uv;
    vec3 transformed = position.xyz;
    transformed.x += sin(time + position.y * 10.0) * 0.5;
    vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 * time * 3.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  varying float vProgress;
  uniform float time;
  uniform vec3 color;
  void main() {
    vec3 finalColor = mix(color, color*0.25, vProgress);
    // float hideCornersStart = smoothstep(1.0, 0.1, vUv.x);
    // float hideCornersEnd = smoothstep(1.0, 0.9, vUv.x);
    gl_FragColor.rgba = vec4(finalColor, 1.0); // hideCornersStart * hideCornersEnd
  }
  `
);

extend({ PathMaterial });

export const NetworkGraphPath = forwardRef(function NetworkGraphLine({ points, userData }: any, ref: any) {
  const pathMat = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (pathMat.current) {
      pathMat.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(0,-0.5,0), new Vector3(0, 0.5, 0)]), []);

  return (
    <mesh ref={ref} userData={userData} matrixAutoUpdate={false} matrix={calculateTransformationMatrix(points[0], points[1])}>
      <tubeGeometry args={[curve, 64, 2, 8, false]} />
      {/* @ts-ignore */}
      <pathMaterial ref={pathMat} side={DoubleSide} />
    </mesh>
  );
});
