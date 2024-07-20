import React, { useRef, useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, AnimationMixer, AnimationClip, AnimationAction, LoopOnce } from 'three';
// @ts-ignore
import * as ThreeFiber from '@react-three/fiber/dist/declarations/src/index';
// @ts-ignore
import { Canvas, Group, useFrame, useLoader, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ModelProps {
  onLoad: (model: Object3D) => void;
}

export const ProjectBrickstorm = () => {
  const [model, setModel] = useState<Object3D | null>(null);

  return (
    <Canvas
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, right: 0 }}
      shadows
      camera={{ position: [400, 30, 80], fov: 10 }}
      frameloop="demand"
    >
      <ambientLight intensity={0.25} />
      <pointLight intensity={5} decay={0.3} position={[5, 30, 3]} />
      <Model onLoad={setModel} />
      <OrbitControls />
    </Canvas>
  );
};

const Model = ({ onLoad }: ModelProps) => {
  const file = useLoader(GLTFLoader, require('./models/eiffel_tower_4_3.glb'));
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
        action.getMixer().addEventListener('finished', () => {
          setIsAnimating(false);
        });
      });

      actions.forEach((action: AnimationAction) => {
        setIsAnimating(true);
        action.play();
        invalidate();
      });
    }
  }, [file]);

  useEffect(() => {
    if (mixer.current) {
      mixer.current.update(0);
      setIsAnimating(true);
      invalidate();
    }
  });


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
        <mesh>
          <primitive object={file.scene} />
        </mesh>
      )}
    </group>
  );
};
