import React, { useRef, forwardRef, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, AnimationClip, Group, Mesh } from 'three';
import { useLoader } from '@react-three/fiber';

export const Dc3Buffalo = forwardRef((_, ref) => {
  const modelRef = useRef<Group>(null);
  const file = useLoader(GLTFLoader, require('./dc3_buffalo_retracted.glb')) as unknown as { scene: Object3D, animations: AnimationClip[] };
  const model = file.scene;

  const movingParts = useMemo(() => {
    const parts: Object3D[] = [];
    model.traverse((child) => {
      const m = child as Mesh;
      if (m.name.startsWith('15790dat')) {
        parts.push(m);
      }
    });
    return parts;
  }, [model]);

  React.useImperativeHandle(ref, () => ({ model: modelRef.current, movingParts }), [model]);

  return (
    <group ref={modelRef}>
      {file.scene &&
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <primitive object={model} />
        </mesh>
      }
    </group >
  );
});
