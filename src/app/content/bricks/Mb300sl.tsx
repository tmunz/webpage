import React, { useRef, useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, AnimationClip, Group } from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export const Mb300sl = () => {
  const [model, setModel] = useState<Object3D | null>(null);

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      shadows
      camera={{ position: [0, 1, -30], fov: 10 }}
      frameloop="demand"
    >
      <ambientLight intensity={0.25} />
      <pointLight intensity={5} decay={0.3} position={[5, 30, 3]} />
      <Model onLoad={setModel} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
};

const Model = ({ onLoad }: { onLoad: (model: Object3D) => void }) => {
  const file = useLoader(GLTFLoader, require('./assets/mb-300sl.glb')) as unknown as { scene: Object3D, animations: AnimationClip[] };
  const sceneRef = useRef<Group>(null!);

  useEffect(() => {
    if (onLoad && file.scene) {
      onLoad(file.scene);
    }
  }, [file, onLoad]);

  return (
    <group ref={sceneRef}>
      {file.scene && (
        <mesh position={[0, -1, 0]}>
          <primitive object={file.scene} />
        </mesh>
      )}
    </group>
  );
};
