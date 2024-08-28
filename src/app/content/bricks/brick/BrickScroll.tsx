import React, { useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";
import { Brick } from "./Brick";
import { useTransformationAnimator, Transformations } from "../../../utils/TransformationAnimator";

export function BrickScroll({transformations}: {transformations: Transformations}) {
  const ref = useRef<Object3D>(null!);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);

  useFrame(() => {
    const state = transformationAnimator.get(scroll.offset);
    if (ref.current) {
      ref.current.rotation.set(state.rotateX, state.rotateY, state.rotateZ);
      ref.current.scale.set(state.scaleX, state.scaleY, state.scaleZ);
      ref.current.position.set(state.positionX, state.positionY, state.positionZ);
    }
  });

  return <Brick onLoadComplete={(model) => (ref.current = model)} />;
}
