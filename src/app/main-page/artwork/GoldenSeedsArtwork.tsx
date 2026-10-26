/* eslint-disable react/no-unknown-property -- Three.js elements use the Fiber renderer. */
import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ArtworkProps, ArtworkSurface, createArtworkFragmentShader, useArtworkUniforms } from './ArtworkSurface';

const SEED_COUNT = 144;
const SEED_SIZE = { base: 0.06, radialGrowth: 0.04 };
const SEED_ANGLE = 2.39996323;
const SEED_ANGLE_RESPONSE = 0.01;

const fragmentShader = createArtworkFragmentShader(`
  vec3 artwork(vec2 uv) {
    vec2 p = (uv - 0.5) * vec2(1.35, 1.0);
    return vec3(0.015, 0.018, 0.012) + vec3(0.045, 0.027, 0.005) * exp(-length(p) * 5.0);
  }
`);

const seedVertexShader = `
  uniform float uTime;
  uniform float uPointScale;
  uniform vec3 uInteraction;
  uniform vec3 uMotion;
  attribute float aSeed;
  varying float vAngle;
  varying float vLight;
  void main() {
    float radius = sqrt((aSeed + 0.5) / ${SEED_COUNT}.0);
    float angleInput = (uInteraction.x + uInteraction.y * 0.5) * uInteraction.z;
    angleInput += uMotion.x * 0.25 + uMotion.y * 0.15;
    float placementAngle = ${SEED_ANGLE.toFixed(8)} + angleInput * ${SEED_ANGLE_RESPONSE.toFixed(3)};
    float angle = aSeed * placementAngle + uTime * 0.075;
    angle += 0.12 * sin(uTime * 0.32 + radius * 5.0);
    float breathe = 0.85 + 0.08 * sin(uTime * 0.35 - radius * 2.0);
    vec3 p = vec3(cos(angle), sin(angle), 0.0) * radius * breathe;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float modelScale = length(modelMatrix[0].xyz);
    gl_PointSize = (${SEED_SIZE.base.toFixed(3)} + radius * ${SEED_SIZE.radialGrowth.toFixed(3)}) * uPointScale * modelScale / -mv.z;
    vAngle = angle;
    vLight = 0.6 + 0.4 * sin(radius * 11.0 - uTime * 0.8);
  }
`;

const seedFragmentShader = `
  varying float vAngle;
  varying float vLight;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float angle = vAngle;
    p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
    float d = length(p * vec2(1.0, 1.35));
    float alpha = 1.0 - smoothstep(0.27, 0.5, d);
    if (alpha < 0.01) discard;
    vec3 color = mix(vec3(0.55, 0.26, 0.04), vec3(1.0, 0.82, 0.3), vLight);
    color += vec3(0.2) * (1.0 - smoothstep(0.0, 0.25, d));
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

function GoldenSeedPoints(props: ArtworkProps) {
  const pixelHeight = useThree(state => state.size.height * state.viewport.dpr);
  const seeds = useMemo(() => Float32Array.from({ length: SEED_COUNT }, (_, index) => index), []);
  const positions = useMemo(() => new Float32Array(SEED_COUNT * 3), []);
  const artworkUniforms = useArtworkUniforms(props);
  const uniforms = useMemo(() => ({ ...artworkUniforms, uPointScale: { value: 1 } }), [artworkUniforms]);
  useFrame(() => {
    uniforms.uPointScale.value = pixelHeight / 0.63;
  });
  return (
    <points position={[0, 0.04, 0.085]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={seedVertexShader} fragmentShader={seedFragmentShader}
        uniforms={uniforms} transparent depthWrite={false} toneMapped={false} />
    </points>
  );
}

export function GoldenSeedsArtwork(props: ArtworkProps) {
  return (
    <group>
      <ArtworkSurface {...props} fragmentShader={fragmentShader} />
      <GoldenSeedPoints {...props} />
    </group>
  );
}
