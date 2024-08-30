import React, { useRef } from 'react';
import { Transformations, useTransformationAnimator } from '../../../utils/TransformationAnimator';
import { RenderTexture, useScroll } from '@react-three/drei';
import { CarShow } from '../../../visualization/car-show/CarShow';
import { Mb300Ssl } from './Mb300sl';
import { Quality } from '../../../visualization/QualityProvider';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';

export function Mb300slScroll({ transformations }: { transformations: Transformations }) {
  const ref = useRef<Mesh | null>(null);
  const scroll = useScroll();
  const transformationAnimator = useTransformationAnimator(transformations);
  const [animate, setAnimate] = React.useState(true);
  const { size } = useThree();

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
    <mesh ref={ref}>
      <planeGeometry args={[size.width / 400, size.height / 400]} />
      <meshStandardMaterial>
        <RenderTexture attach='map'>
          <CarShow Model={Mb300Ssl} animate={animate} quality={Quality.HIGH} />
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  );
};