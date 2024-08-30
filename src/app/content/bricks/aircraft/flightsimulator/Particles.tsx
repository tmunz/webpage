import React, { useRef, forwardRef, ForwardedRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { getRandomColor } from '../../../../utils/ColorUtils';
import { BoxGeometry, Mesh, MeshLambertMaterial, SphereGeometry, TetrahedronGeometry } from 'three';

const BOUNDARY = 20;
const MAX_Z = 1;

export const Particles = forwardRef(({ amount = 100 }: { amount?: number }, ref: ForwardedRef<Mesh[]>) => {
  const flyingParticles = useRef<Mesh[]>([]);
  const waitingParticles = useRef<Mesh[]>([]);

  React.useImperativeHandle(ref, () => flyingParticles.current);

  const createParticle = () => {
    let geometryCore;
    const rnd = Math.random();

    if (rnd < 0.33) {
      geometryCore = new BoxGeometry(0.1 + Math.random(), 0.1 + Math.random(), 0.1 + Math.random());
    } else if (rnd < 0.66) {
      geometryCore = new TetrahedronGeometry(0.2 + Math.random() * 0.2);
    } else {
      geometryCore = new SphereGeometry(0.2 + Math.random() * 0.2, 16, 8);
    }

    const materialCore = new MeshLambertMaterial({
      color: getRandomColor(['#dff69e', '#00ceff', '#002bca', '#ff00e0', '#3f159f', '#71b583', '#00a2ff']),
      flatShading: true,
    });

    return new Mesh(geometryCore, materialCore);
  };

  const getParticle = () => waitingParticles.current.pop() || createParticle();

  useEffect(() => {
    waitingParticles.current = [];
    flyingParticles.current = [];
    for (let i = 0; i < amount; i++) {
      const particle = getParticle();
      particle.position.set(
        Math.random() * BOUNDARY * 2 - BOUNDARY,
        Math.random() * BOUNDARY * 2 - BOUNDARY,
        Math.random() * MAX_Z
      );
      flyingParticles.current.push(particle);
    }
  }, [amount]);

  useFrame(() => {
    flyingParticles.current.forEach((particle, index) => {
      if (particle.position.x < -BOUNDARY) {
        waitingParticles.current.push(particle);
        flyingParticles.current.splice(index, 1);
      }
    });

    while (flyingParticles.current.length < amount) {
      const particle = getParticle();
      particle.position.set(BOUNDARY, Math.random() * BOUNDARY * 2 - BOUNDARY, Math.random() * MAX_Z);
      flyingParticles.current.push(particle);
    }
  });

  return (
    <group>
      {flyingParticles.current.map((particle, index) => (
        <primitive key={index} object={particle} />
      ))}
    </group>
  );
});
