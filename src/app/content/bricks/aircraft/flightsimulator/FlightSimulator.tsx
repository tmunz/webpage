import React, { useRef } from 'react';
import { Particles } from './Particles';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Object3D } from 'three';
import { Dc3Buffalo } from '../Dc3Buffalo';
import { clamp } from 'three/src/math/MathUtils';

export function FlightSimulator() {
  const SMOOTHNESS = 10;

  const { pointer } = useThree();
  const particlesRef = useRef<Mesh[]>([]);
  const airplaneRef = useRef<{ model: Object3D, movingParts: Object3D[] }>(null);

  const { scene } = useThree();

  useFrame(() => {
    const speed = 1 + (pointer.x + 1) * 3;
    scene.backgroundRotation.set(
      clamp(scene.backgroundRotation.x + (pointer.y * -0.5) / SMOOTHNESS, -0.2, 0.2),
      scene.backgroundRotation.y + (speed / 300),
      0,
      'XYZ'
    );

    const airplane = airplaneRef.current?.model;
    if (airplane) {
      airplane.rotation.x += (-pointer.y / 3 - airplane.rotation.x) / SMOOTHNESS;
      airplane.rotation.y += (speed / 300 - airplane.rotation.y) / SMOOTHNESS;
      airplane.rotation.z += (pointer.y / 3 - airplane.rotation.z) / SMOOTHNESS;
      airplane.position.x += (pointer.x * 10 - airplane.position.x) / SMOOTHNESS;
      airplane.position.y += (pointer.y * 10 - airplane.position.y) / SMOOTHNESS;
    }

    airplaneRef.current?.movingParts.forEach((part) => {
      part.rotation.x += (speed * Math.PI) / 24;
    });

    const particles = particlesRef.current;
    if (particles) {
      particles.forEach((particle) => {
        particle.position.x -= 0.3 * speed;
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
      <directionalLight position={[0, 10, 0]} intensity={4} />
      <Environment
        files={require('./sky.hdr')}
        background
        environmentIntensity={0.8}
      />
      <Dc3Buffalo ref={airplaneRef} />
      <Particles ref={particlesRef} />
      {/* <axesHelper args={[5]} /> */}
    </>
  );
};
