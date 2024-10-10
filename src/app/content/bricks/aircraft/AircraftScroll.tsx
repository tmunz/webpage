import React, { useRef } from "react";
import { RenderTexture, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useTransformationAnimator, Transformations } from "../../../utils/TransformationAnimator";
import { FlightSimulator } from "./flightsimulator/FlightSimulator";
import { FullscreenPlane } from "../../../three/FullscreenPlane";

export function AircraftScroll({ transformations, onLoadComplete }: { transformations: Transformations, onLoadComplete: () => void }) {
  const ref = useRef<Mesh>(null!);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);

  useFrame(() => {
    if (ref.current) {
      transformationAnimator.apply(ref.current, scroll.offset)
    }
  });

  return <FullscreenPlane ref={ref}>
    <meshStandardMaterial>
      <RenderTexture attach='map'>
        <group scale={[0.1, 0.1, 0.1]}>
          <FlightSimulator onLoadComplete={onLoadComplete} />
        </group>
      </RenderTexture>
    </meshStandardMaterial>
  </FullscreenPlane >
}
