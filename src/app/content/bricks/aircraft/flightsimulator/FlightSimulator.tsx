import React, { useRef } from 'react';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Object3D } from 'three';
import { Dc3Buffalo } from '../Dc3Buffalo';
import { clamp } from 'three/src/math/MathUtils';
import { Part, Particles } from './Particles';

export function FlightSimulator() {
  const SMOOTHNESS = 10;

  const { pointer } = useThree();
  const particlesRef = useRef<Part[]>([]);
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
      airplane.rotation.y += (speed / 30 - airplane.rotation.y) / SMOOTHNESS;
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
        particle.object.position.x -= 0.3 * speed;
        particle.object.position.y -= 0.3 * pointer.y;
        if (particle.rotation) {
          particle.object.rotation.x += (Math.random() - 0.5);
          particle.object.rotation.y += (Math.random() - 0.5);
          particle.object.rotation.z += (Math.random() - 0.5);
        }
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
      <Particles ref={particlesRef} amount={1000} />
      {/* <axesHelper args={[5]} /> */}
    </>
  );
};
