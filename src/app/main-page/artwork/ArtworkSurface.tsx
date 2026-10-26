/* eslint-disable react/no-unknown-property -- Three.js elements use the Fiber renderer. */
import React, { MutableRefObject, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export interface ArtworkProps {
  time: MutableRefObject<number>;
  interaction: MutableRefObject<Vector3>;
  motion: MutableRefObject<Vector3>;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function createArtworkFragmentShader(artwork: string) {
  return `
  uniform float uTime;
  uniform vec3 uInteraction;
  uniform vec3 uMotion;
  varying vec2 vUv;
  float line(float distance, float width) {
    return 1.0 - smoothstep(width, width + 0.003, abs(distance));
  }


  ${artwork}

  void main() {
    vec3 color = artwork(vUv);
    float vignette = 1.0 - 0.18 * pow(length(vUv - 0.5), 2.0);
    gl_FragColor = vec4(color * vignette, 1.0);
    #include <colorspace_fragment>
  }
`;
}

export function useArtworkUniforms({ time, interaction, motion }: ArtworkProps) {
  // Keep the material's uniform objects stable when selection changes input refs.
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uInteraction: { value: new Vector3() },
    uMotion: { value: new Vector3() } }), []);
  useFrame(() => {
    uniforms.uTime.value = time.current;
    uniforms.uInteraction.value.copy(interaction.current);
    uniforms.uMotion.value.copy(motion.current);
  });
  return uniforms;
}

export function ArtworkSurface({ fragmentShader, ...props }: ArtworkProps & { fragmentShader: string }) {
  const uniforms = useArtworkUniforms(props);
  return (
    <mesh position={[0, 0.04, 0.075]}>
      <planeGeometry args={[3.13, 2.32]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} toneMapped={false} />
    </mesh>
  );
}
