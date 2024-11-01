import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";
import { Brick } from "./Brick";
import { useTransformationAnimator, Transformations } from "../../../utils/TransformationAnimator";

export function BrickScroll({ transformations, progress }: { transformations: Transformations, progress: number }) {
  const ref = useRef<Object3D>(null!);
  const transformationAnimator = useTransformationAnimator(transformations);

  useFrame(() => {
    if (ref.current) {
      transformationAnimator.apply(ref.current, progress, 0.92);
    }
  });

  return <Brick onLoadComplete={(model) => {
    ref.current = model;
  }} />;
}
