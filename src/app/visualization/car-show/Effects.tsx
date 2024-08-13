import React, { useRef, useState } from 'react'
import { Leva, useControls } from 'leva';
import { EffectComposer, ChromaticAberration, DepthOfField, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { Quality } from '../QualityProvider';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

export function Effects({ camera, quality, debug, focus }: { camera: PerspectiveCamera | null, quality: Quality, debug?: boolean, focus?: { position: Vector3, dimensions: Vector3 } }) {

  const [focusTarget, setFocusTarget] = useState<Vector3>(new Vector3(0, 1, 0));
  const { current: directionVector } = useRef(new Vector3());

  useFrame(() => {
    if (camera && focus) {
      const direction = directionVector.subVectors(camera.position, focusTarget).normalize();
      setFocusTarget(focus.position.clone().add(direction.multiply(focus.dimensions)));
    }
  });

  const { ...props } = useControls({
    bokehScale: { value: 2.5, min: 0, max: 10 },
    focusRange: { value: 2.5, min: 0, max: 10 },
    ca_offsetX: { value: 0.001, min: 0, max: 1 },
    ca_offsetY: { value: 0.001, min: 0, max: 1 },
    ca_radialModulation: true,
    ca_modulationOffset: { value: 0, min: 0, max: 10 },
    bloom_intensity: { value: 1.5, min: 0, max: 50 },
    bloom_opacity: { value: 0.4, min: 0, max: 1 },
    bloom_minMapBlur: true,
    bloom_luminanceSmoothingy: { value: 0.5, min: 0, max: 1 },
    bloom_luminanceThreshold: { value: 0.5, min: 0, max: 1 },
  });

  const cameraViewDistance = (camera?.far ?? 2000) - (camera?.near ?? 0.1);

  const effects = [];
  switch (quality) {
    case Quality.PERFORMANCE:
      effects.push(<ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(props.ca_offsetX, props.ca_offsetY)}
        radialModulation={props.ca_radialModulation}
        modulationOffset={props.ca_modulationOffset}
      />);
    case Quality.HIGH:
    case Quality.MIDDLE:
      effects.push(<DepthOfField
        bokehScale={props.bokehScale}
        blendFunction={BlendFunction.NORMAL}
        focusRange={props.focusRange / cameraViewDistance}
        target={focusTarget}
      />);
    case Quality.LOW:
      effects.push(<Bloom
        luminanceThreshold={props.bloom_luminanceThreshold}
        mipmapBlur={props.bloom_minMapBlur}
        luminanceSmoothing={props.bloom_luminanceSmoothingy}
        opacity={props.bloom_opacity}
        intensity={props.bloom_intensity}
      />);
    case Quality.PERFORMANCE:
      break;
  }

  return (
    <>
      <Leva hidden={!debug} />
      <EffectComposer>
        {effects.map((effect, index) => React.cloneElement(effect, { key: index }))}
      </EffectComposer>
      {debug && <Box args={[.1, .1, .1]} position={focusTarget}>
        <meshBasicMaterial color="red" />
      </Box>}
    </>
  )
}
