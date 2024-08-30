import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { getRandomColor } from '../../../../utils/ColorUtils';
import { BoxGeometry, Mesh, MeshLambertMaterial, SphereGeometry, TetrahedronGeometry } from 'three';


const BOUNDARY = 10;
const MAX_Z = 10;

export const Particles = forwardRef(({ amount = 200 }: { amount?: number }, ref: any) => {

  const { current: flyingParticles } = useRef<Mesh[]>([]);
  const { current: waitingParticles } = useRef<Mesh[]>([]);

  React.useImperativeHandle(ref, () => flyingParticles);

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
      flatShading: true
    });

    return new Mesh(geometryCore, materialCore);
  };

  const getParticle = () => waitingParticles.pop() || createParticle();

  useFrame(() => {
    flyingParticles.forEach((particle) => {
      if (particle.position.x < -BOUNDARY) {
        flyingParticles.splice(flyingParticles.indexOf(particle), 1);
        waitingParticles.push(particle);
      }
    });
    if (flyingParticles.length < amount) {
      const particle = getParticle();
      particle.position.set(BOUNDARY, Math.random() * BOUNDARY * 2 - BOUNDARY, Math.random() * MAX_Z);
      particle.scale.set(0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random());
      flyingParticles.push(particle);
    }
  });

  return flyingParticles.map((particle, index) => (
    <primitive key={index} object={particle} />
  ));
});