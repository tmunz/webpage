import React, { useRef, useEffect, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, AnimationClip, Mesh, MeshBasicMaterial, Color, Group } from 'three';
import { useLoader } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';
import { CarShowModelProps } from '../../../three/car-show/CarShowModelProps';

export function Mb300sl({ onLoadComplete }: CarShowModelProps) {
  const modelRef = useRef<Group>(null);
  const headlightTargetRef = useRef<Mesh>(null);

  const file = useLoader(GLTFLoader, require('./mb_300sl.glb')) as unknown as { scene: Object3D, animations: AnimationClip[] };
  const white = new Color(0xffffff);
  const red = new Color(0xff6666);

  const model = useMemo(() => {
    const m = file.scene;
    // TODO change material instead of traversing
    // applyProps(materials.grey, { metalness: 0, color: '#292929' })
    // applyProps(materials.light, { emissiveIntensity: 3, toneMapped: false })
    m.traverse((child) => {
      const m = child as Mesh;
      if (m.name.startsWith('4740dat')) {
        m.material = new MeshBasicMaterial({ color: white });
      } else if ((m.material as any)?.name === '36 Trans_Red') {
        m.material = new MeshBasicMaterial({ color: red });
      }
    });

    return m
  }, [file]);

  useEffect(() => {
    if (file.scene && modelRef.current) {
      onLoadComplete(modelRef.current);
    }
  }, [file, onLoadComplete, modelRef.current]);

  const headlightTarget = headlightTargetRef.current!;

  return (
    <group ref={modelRef}>
      <mesh position={[0, 0, -1000]} ref={headlightTargetRef} />
      {file.scene && headlightTarget &&
        <>
          <mesh position={[0, 0, 0]}>
            <primitive object={model} />
          </mesh>
          {[-1.35, 1.35].map((x, i) => (
            <SpotLight
              key={i}
              position={[x, 1.2, -3.9]}
              target={headlightTarget}
              color={'#ffffee'}
              radiusTop={0.2}
              penumbra={1}
              distance={50}
              angle={Math.PI}
              attenuation={10}
              anglePower={2}
              intensity={10}
              opacity={0.3}
            />
          ))}
          {[-1.3, 1.3].map((x, i) => (
            <pointLight
              key={i}
              position={[x, 0.9, 4.2]}
              color={red}
              distance={5}
              intensity={0.5}
            />
          ))}
        </>
      }
    </group >
  );
};
