import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Brick } from "./Brick";
import { useTransformationAnimator, Transformations } from "../../../utils/TransformationAnimator";
import { BehaviorSubject } from "rxjs";

export function BrickScroll({ transformations, progress$ }: { transformations: Transformations, progress$: BehaviorSubject<number> }) {
  const ref = useRef<Group | null>(null);
  const transformationAnimator = useTransformationAnimator(transformations);

  useFrame(() => {
    if (ref.current) {
      transformationAnimator.apply(ref.current, progress$.getValue(), 0.82, 0.92);
      ref.current.visible = true;
    }
  });

  return <Brick modelRef={ref} />;
}
