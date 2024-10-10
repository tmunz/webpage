import React, { useRef } from 'react';
import { Transformations, useTransformationAnimator } from '../../../utils/TransformationAnimator';
import { RenderTexture, useScroll } from '@react-three/drei';
import { CarShow } from '../../../three/car-show/CarShow';
import { Mb300sl } from './Mb300sl';
import { Quality } from '../../../three/QualityProvider';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { FullscreenPlane } from '../../../three/FullscreenPlane';

export function Mb300slScroll({ transformations, onLoadComplete }: { transformations: Transformations, onLoadComplete: () => void }) {
  const ref = useRef<Mesh | null>(null);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);
  const [animate, setAnimate] = React.useState(true);

  useFrame(() => {
    // TODO move animation logig to Bricks States
    const top = 0.02;
    const bottom = 0.17;
    if (top <= scroll.offset && scroll.offset <= bottom && !animate) {
      setAnimate(true);
    } else if ((scroll.offset < top || bottom < scroll.offset) && animate) {
      setAnimate(false);
    }
    //
    if (ref.current) {
      transformationAnimator.apply(ref.current, scroll.offset);
    }
  });


  return (
    <FullscreenPlane ref={ref}>
      <meshStandardMaterial>
        <RenderTexture attach='map'>
          <CarShow Model={Mb300sl} animate={animate} quality={Quality.HIGH} onLoadComplete={onLoadComplete} />
        </RenderTexture>
      </meshStandardMaterial>
    </FullscreenPlane>
  );
};