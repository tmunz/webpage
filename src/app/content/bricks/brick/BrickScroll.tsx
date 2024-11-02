import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";
import { Brick } from "./Brick";
import { useTransformationAnimator, Transformations } from "../../../utils/TransformationAnimator";
import { BehaviorSubject } from "rxjs";

export function BrickScroll({ transformations, progress$ }: { transformations: Transformations, progress$: BehaviorSubject<number> }) {
  const ref = useRef<Object3D | null>(null);
  const transformationAnimator = useTransformationAnimator(transformations);

  useFrame(() => {
    if (ref.current) {
      transformationAnimator.apply(ref.current, progress$.getValue(), 0.82, 0.92);
    }
  });

  return <Brick onLoadComplete={(model) => { ref.current = model; }} />;
}
