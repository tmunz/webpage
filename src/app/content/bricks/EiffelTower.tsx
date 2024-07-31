import React, { useRef, useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, AnimationMixer, AnimationClip, AnimationAction, LoopOnce, Group } from 'three';
import { Canvas, useFrame, useLoader, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export const EiffelTower = () => {
  const [model, setModel] = useState<Object3D | null>(null);

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      shadows
      camera={{ position: [-40, 0, 50], fov: 24 }}
      frameloop="demand"
    >
      <ambientLight intensity={0.1} />
      <pointLight intensity={5} decay={0.3} position={[10, 10, -5]} />
      <Model onLoad={setModel} />
      <OrbitControls enabled={false} />
    </Canvas>
  );
};

const Model = ({ onLoad }: { onLoad: (model: Object3D) => void }) => {
  const file = useLoader(GLTFLoader, require('./assets/eiffel_tower_4_3.glb')) as unknown as { scene: Object3D, animations: AnimationClip[] };
  const mixer = useRef<AnimationMixer | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const sceneRef = useRef<Group>(null!);

  useEffect(() => {
    if (file.animations.length > 0) {
      mixer.current = new AnimationMixer(file.scene);
      const actions = file.animations.map((clip: AnimationClip) => {
        const a = mixer.current!.clipAction(clip);
        a.clampWhenFinished = true;
        a.loop = LoopOnce;
        return a;
      });

      actions.forEach((action: AnimationAction) => {
        setIsAnimating(true);
        action.getMixer().addEventListener('finished', () => {
          setIsAnimating(false);
        });
        action.play();
      });
    }
  }, [file]);

  useEffect(() => {
    invalidate();
  }, [mixer.current]);


  useFrame((_: any, delta: number) => {
    if (mixer.current) {
      mixer.current.update(delta);
      if (isAnimating) {
        invalidate();
      }
    }
  });

  useEffect(() => {
    if (onLoad && file.scene) {
      onLoad(file.scene);
    }
  }, [file, onLoad]);

  return (
    <group ref={sceneRef}>
      {file.scene && (
        <mesh position={[0, -9, 0]}>
          <primitive object={file.scene} />
        </mesh>
      )}
    </group>
  );
};
