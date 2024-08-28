import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getRandomColor = (colors: string[]) => {
  const col = hexToRgb(colors[Math.floor(Math.random() * colors.length)]);
  return new THREE.Color(`rgb(${col?.r},${col?.g},${col?.b})`);
};

const Plane: React.FC<{ mousePos: { x: number; y: number }; speed: { x: number; y: number }; smoothing: number }> = ({ mousePos, speed, smoothing }) => {
  const planeRef = useRef<THREE.Group>(null);
  const colors = ['#dff69e', '#00ceff', '#002bca', '#ff00e0', '#3f159f', '#71b583', '#00a2ff'];
  useFrame(() => {
    const plane = planeRef.current;
    if (plane) {
      plane.rotation.z += ((-speed.y / 50) - plane.rotation.z) / smoothing;
      plane.rotation.x += ((-speed.y / 50) - plane.rotation.x) / smoothing;
      plane.rotation.y += ((-speed.y / 50) - plane.rotation.y) / smoothing;
      plane.position.x += (((mousePos.x - window.innerWidth / 2)) - plane.position.x) / smoothing;
      plane.position.y += ((-speed.y * 10) - plane.position.y) / smoothing;
    }
  });

  return (
    <group ref={planeRef}>
      <mesh>
        <boxGeometry args={[120, 120, 120]} />
        <meshLambertMaterial color={getRandomColor(colors)} />
      </mesh>
      <mesh position={[-60, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0, 60, 60, 4]} />
        <meshLambertMaterial color={0xff00dc} />
      </mesh>
      <mesh position={[65, -47, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[25, 10, 120]} />
        <meshLambertMaterial color={0x80f5fe} />
      </mesh>
      {/* Other plane parts (fins, eyes, etc.) can be added here similarly */}
    </group>
  );
};

// Particles Component
const Particles: React.FC = () => {
  const [flyingParticles, setFlyingParticles] = useState<THREE.Mesh[]>([]);
  const waitingParticles = useRef<THREE.Mesh[]>([]);
  const maxParticlesZ = 600;

  const { size } = useThree();

  const createParticle = () => {
    let geometryCore;
    const rnd = Math.random();

    if (rnd < 0.33) {
      geometryCore = new THREE.BoxGeometry(10 + Math.random() * 30, 10 + Math.random() * 30, 10 + Math.random() * 30);
    } else if (rnd < 0.66) {
      geometryCore = new THREE.TetrahedronGeometry(10 + Math.random() * 20);
    } else {
      geometryCore = new THREE.SphereGeometry(5 + Math.random() * 30, 2 + Math.floor(Math.random() * 2), 2 + Math.floor(Math.random() * 2));
    }

    const materialCore = new THREE.MeshLambertMaterial({
      color: getRandomColor(['#dff69e', '#00ceff', '#002bca', '#ff00e0', '#3f159f', '#71b583', '#00a2ff']),
      flatShading: true
    });

    return new THREE.Mesh(geometryCore, materialCore);
  };

  const getParticle = () => waitingParticles.current.pop() || createParticle();

  useEffect(() => {
    const interval = setInterval(() => {
      const particle = getParticle();
      particle.position.set(size.width / 2, Math.random() * size.height - size.height / 2, Math.random() * maxParticlesZ);
      particle.scale.set(0.1 + Math.random(), 0.1 + Math.random(), 0.1 + Math.random());

      setFlyingParticles((prev) => [...prev, particle]);

    }, 70);

    return () => clearInterval(interval);
  }, [size]);

  useFrame(() => {
    setFlyingParticles((prevParticles) => {
      const updatedParticles = prevParticles.map((particle) => {
        particle.position.x -= 10;
        particle.rotation.x += 0.05;
        particle.rotation.y += 0.05;
        particle.rotation.z += 0.05;

        if (particle.position.x < -size.width / 2 - 80) {
          waitingParticles.current.push(particle);
          return null;
        }

        return particle;
      }).filter(Boolean);

      return updatedParticles as THREE.Mesh[];
    });
  });

  return (
    <>
      {flyingParticles.map((particle, index) => (
        <primitive key={index} object={particle} />
      ))}
    </>
  );
};

export function FlightSimulator() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [speed, setSpeed] = useState({ x: 0, y: 0 });
  const smoothing = 10;

  const handleMouseMove = (event: MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
    setSpeed({
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY - window.innerHeight / 2) / 10,
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 1000], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      <Plane mousePos={mousePos} speed={speed} smoothing={smoothing} />
      <Particles />
      <OrbitControls />
      <Stats />
    </Canvas>
  );
};
