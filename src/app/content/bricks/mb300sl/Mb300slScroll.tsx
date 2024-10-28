import React, { useRef } from 'react';
import { Transformations, useTransformationAnimator } from '../../../utils/TransformationAnimator';
import { RenderTexture, useScroll } from '@react-three/drei';
import { CarShow } from '../../../three/car-show/CarShow';
import { Mb300sl } from './Mb300sl';
import { Quality } from '../../../three/QualityProvider';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { FullscreenPlane } from '../../../three/FullscreenPlane';

export function Mb300slScroll({ transformations, onLoadComplete, animationTrigger }: { transformations: Transformations, onLoadComplete: () => void, animationTrigger: [number, number] }) {
  const elementRef = useRef<Mesh | null>(null);
  const carShowRef = useRef<{ controls: any }>(null);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);
  const [animate, setAnimate] = React.useState(true);

  useFrame(() => {
    const top = animationTrigger[0];
    const bottom = animationTrigger[1];
    if (top <= scroll.offset && scroll.offset <= bottom && !animate) {
      setAnimate(true);
    } else if ((scroll.offset < top || bottom < scroll.offset) && animate) {
      setAnimate(false);
    }
    if (elementRef.current) {
      transformationAnimator.apply(elementRef.current, scroll.offset);
    }
    if (carShowRef.current) {
      // carShowRef.current.controls.setAzimuthalAngle(scroll.offset * 10);
    }
  });


  return (
    <FullscreenPlane ref={elementRef}>
      <meshStandardMaterial>
        <RenderTexture attach='map'>
          <CarShow ref={carShowRef} Model={Mb300sl} animate={animate} quality={Quality.HIGH} onLoadComplete={onLoadComplete} controls={false} />
        </RenderTexture>
      </meshStandardMaterial>
    </FullscreenPlane>
  );
};