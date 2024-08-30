import React from 'react';
import { Particles } from './Particles';
import { Airplane } from './Airplane';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh } from 'three';

export function FlightSimulator() {
  const smoothing = 10;
  const { pointer } = useThree();
  const particlesRef = React.useRef<Mesh[]>([]);
  const airplaneRef = React.useRef<Group>(null);

  useFrame(() => {
    const speedX = 1 + (pointer.x + 1) / 2;

    const airplane = airplaneRef.current;
    if (airplane) {
      airplane.rotation.x += ((pointer.x - 1) / 10 - airplane.rotation.x) / smoothing;
      airplane.rotation.y += (speedX / 100 - airplane.rotation.y) / smoothing;
      airplane.rotation.z += ((pointer.y - pointer.x) / 3 - airplane.rotation.z) / smoothing;
      airplane.position.x += (pointer.x * 10 - airplane.position.x) / smoothing;
      airplane.position.y += (pointer.y * 10 - airplane.position.y) / smoothing;
    }

    const particles = particlesRef.current;
    if (particles) {
      particles.forEach((particle) => {
        particle.position.x -= 0.3 * speedX;
        particle.position.y -= 0.3 * pointer.y;
        particle.rotation.x += 0.05;
        particle.rotation.y += 0.05;
        particle.rotation.z += 0.05;
      });
    }
  });

  return (
    <>
      <PerspectiveCamera position={[0, 0, 9]} fov={14} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      <Airplane ref={airplaneRef} />
      <Particles ref={particlesRef} amount={200} />
    </>
  );
};
