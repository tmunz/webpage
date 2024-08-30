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
    if (ref.current) {
      transformationAnimator.apply(ref.current, scroll.offset);
    }
  });

  return <Brick onLoadComplete={(model) => (ref.current = model)} />;
}
