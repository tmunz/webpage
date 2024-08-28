import React, { useRef, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, Group } from 'three';
import { useLoader } from '@react-three/fiber';

export function Brick({ onLoadComplete }: { onLoadComplete: (model: Object3D) => void }) {
  const modelRef = useRef<Group>(null);

  const file = useLoader(GLTFLoader, require('./brick_2x4.glb')) as unknown as { scene: Object3D };

  useEffect(() => {
    if (file.scene && modelRef.current) {
      onLoadComplete(modelRef.current);
    }
  }, [file, onLoadComplete, modelRef.current]);

  return (
    <group ref={modelRef}>
      {
        file.scene && <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          <primitive object={file.scene}/>
        </mesh>
      }
    </group >
  );
};
