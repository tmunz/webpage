import React, { useRef } from 'react';
import { Transformations, useTransformationAnimator } from '../../../utils/TransformationAnimator';
import { CarShow } from '../../../three/car-show/CarShow';
import { Mb300sl } from './Mb300sl';
import { Quality } from '../../../three/QualityProvider';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export function Mb300slScroll({ transformations, progress, animationTrigger }: { transformations: Transformations, progress: number, animationTrigger: [number, number] }) {
  const elementRef = useRef<Mesh | null>(null);
  const carShowRef = useRef<{ controls: any }>(null);
  const transformationAnimator = useTransformationAnimator(transformations);
  const [animate, setAnimate] = React.useState(true);

  useFrame(() => {
    const top = animationTrigger[0];
    const bottom = animationTrigger[1];
    if (top <= progress && progress <= bottom && !animate) {
      setAnimate(true);
    } else if ((progress < top || bottom < progress) && animate) {
      setAnimate(false);
    }
    if (elementRef.current) {
      transformationAnimator.apply(elementRef.current, progress);
    }
    if (carShowRef.current) {
      // carShowRef.current.controls.setAzimuthalAngle(scroll.offset * 10);
    }
  });


  return (
    <CarShow ref={carShowRef} Model={Mb300sl} animate={animate} quality={Quality.HIGH} controls={false} />
  );
};