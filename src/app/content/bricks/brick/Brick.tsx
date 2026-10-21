import React, { MutableRefObject } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, Group } from 'three';
import { useLoader } from '@react-three/fiber';

export function Brick({ modelRef }: { modelRef: MutableRefObject<Group | null> }) {
  const file = useLoader(GLTFLoader, require('./brick_2x4.glb')) as unknown as { scene: Object3D };

  return (
    <group ref={modelRef} visible={false}>
      {file.scene &&
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          <primitive object={file.scene} />
        </mesh>
      }
    </group >
  );
};
