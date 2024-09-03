import React, { useRef, forwardRef, ForwardedRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const BOUNDARY = 20;
const MAX_Z = 1;

export enum PartType {
  PLATE_ROUND = 1,
  BIRD = 0,
  CLOUD = 2,
}

export interface Part {
  object: Object3D;
  rotation: boolean;
}

export const Particles = forwardRef(({ amount = 100 }: { amount?: number }, ref: ForwardedRef<Part[]>) => {
  const { current: flyingParticles } = useRef<Part[]>([]);
  const { current: waitingParticles } = useRef<Part[]>([]);
  const { current: removeIndexes } = useRef<number[]>([]);
  const particles = useLoader(GLTFLoader, require('./particles.glb')) as unknown as { scene: Object3D };

  React.useImperativeHandle(ref, () => flyingParticles);

  const createParticle = (): Part => {
    const rnd = Math.random();
    let type = PartType.PLATE_ROUND;

    if (rnd < 0.01) {
      type = PartType.BIRD;
    } else if (rnd < 0.02) {
      type = PartType.CLOUD;
    }

    const part = (particles.scene.children[type] as Object3D).clone();
    part.scale.copy(new Vector3(0.01, 0.01, 0.01));
    return { object: part, rotation: type === PartType.PLATE_ROUND };
  };

  const getParticle = () => waitingParticles.pop() || createParticle();

  useEffect(() => {
    waitingParticles.length = 0;
    flyingParticles.length = 0;
    for (let i = 0; i < amount; i++) {
      const particle = getParticle();
      particle.object.position.set(
        Math.random() * BOUNDARY * 2 - BOUNDARY,
        Math.random() * BOUNDARY * 2 - BOUNDARY,
        Math.random() * MAX_Z
      );
      flyingParticles.push(particle);
    }
  }, [amount]);

  useFrame(() => {
    removeIndexes.length = 0;
    flyingParticles.forEach((particle, i) => {
      if (particle.object.position.x < -BOUNDARY) {
        removeIndexes.push(i);
        waitingParticles.push(particle);
      }
    });

    removeIndexes.reverse().forEach(i => flyingParticles.splice(i, 1));

    while (flyingParticles.length < amount) {
      const particle = getParticle();
      particle.object.position.set(
        BOUNDARY + Math.random(),
        Math.random() * BOUNDARY * 2 - BOUNDARY,
        Math.random() * MAX_Z
      );
      flyingParticles.push(particle);
    }
  });

  return (
    <group>
      {flyingParticles.map((particle, index) => (
        <primitive key={index} object={particle.object} />
      ))}
    </group>
  );
});
