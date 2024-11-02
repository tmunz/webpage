import React, { useRef } from 'react';
import { CarShow } from '../../../three/car-show/CarShow';
import { Mb300sl } from './Mb300sl';
import { Quality } from '../../../three/QualityProvider';
import { useFrame } from '@react-three/fiber';

export function Mb300slScroll({ progress, animationTrigger, onLoadComplete }: { progress: number, animationTrigger: [number, number], onLoadComplete: () => void }) {
  const carShowRef = useRef<{ controls: any }>(null);
  const [animate, setAnimate] = React.useState(true);

  useFrame(() => {
    const top = animationTrigger[0];
    const bottom = animationTrigger[1];
    const relativeProgress = (progress - top) / (bottom - top);
    const rotationProgress = Math.max(-0.3 + relativeProgress, 0);

    if (top <= progress && progress <= bottom && !animate) {
      setAnimate(true);
    } else if ((progress < top || bottom < progress) && animate) {
      setAnimate(false);
    }

    if (carShowRef.current) {
      carShowRef.current.controls.setAzimuthalAngle(1.2 * Math.PI + rotationProgress * 2);
    }
  });


  return (
    <CarShow ref={carShowRef} Model={Mb300sl} animate={animate} quality={Quality.HIGH} controls={false} onLoadComplete={onLoadComplete} />
  );
};