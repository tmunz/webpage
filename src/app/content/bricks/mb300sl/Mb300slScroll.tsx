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
    const state = transformationAnimator.get(scroll.offset);
    // TODO move animation logig to Bricks States
    if (0.02 <= scroll.offset && scroll.offset <= 0.12 && !animate) {
      setAnimate(true);
    } else if ((scroll.offset < 0.02 || 0.12 < scroll.offset) && animate) {
      setAnimate(false);
    }
    if (ref.current) {
      ref.current.rotation.set(state.rotateX, state.rotateY, state.rotateZ);
      ref.current.scale.set(state.scaleX, state.scaleY, state.scaleZ);
      ref.current.position.set(state.positionX, state.positionY, state.positionZ);
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