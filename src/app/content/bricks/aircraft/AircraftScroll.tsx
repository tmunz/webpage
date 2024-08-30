import React, { useRef } from "react";
import { RenderTexture, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh } from "three";
import { useTransformationAnimator, Transformations } from "../../../utils/TransformationAnimator";
import { FlightSimulator } from "./flightsimulator/FlightSimulator";

export function AircraftScroll({ transformations }: { transformations: Transformations }) {
  const ref = useRef<Mesh>(null!);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);
  const { size } = useThree();

  useFrame(() => {
    if (ref.current) {
      transformationAnimator.apply(ref.current, scroll.offset)
    }
  });

  return <mesh ref={ref}>
    <planeGeometry args={[size.width / 400, size.height / 400]} />
    <meshStandardMaterial>
      <RenderTexture attach='map'>
        <group scale={[0.1, 0.1, 0.1]}>
          <FlightSimulator />
        </group>
      </RenderTexture>
    </meshStandardMaterial>
  </mesh >
}
