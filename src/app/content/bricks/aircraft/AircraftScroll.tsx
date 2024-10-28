import React, { useEffect, useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useTransformationAnimator, Transformations } from '../../../utils/TransformationAnimator';
import { FullscreenPlane } from '../../../three/FullscreenPlane';

export function AircraftScroll({ transformations, onLoadComplete }: { transformations: Transformations, onLoadComplete: () => void }) {
  const ref = useRef<Mesh>(null!);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);

  useEffect(() => {
    onLoadComplete();
  }, []);

  useFrame(() => {
    if (ref.current) {
      transformationAnimator.apply(ref.current, scroll.offset)
    }
  });

  return <FullscreenPlane ref={ref}>
    <meshStandardMaterial>
      
    </meshStandardMaterial>
  </FullscreenPlane >
}
