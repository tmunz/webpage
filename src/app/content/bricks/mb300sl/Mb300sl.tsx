import React, { useEffect, useRef, useState } from 'react';
import { Object3D, Vector2, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera, SpotLight, Stats } from '@react-three/drei';
import { Model } from './Model';
import { EffectComposer, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from 'three';
import { Ground } from './Ground';
import { ModelMovement } from './ModelMovement';

export const Mb300sl = () => {
  const [model, setModel] = useState<Object3D | null>(null);
  const [dof, setDof] = useState<any>({ focusDistance: 5, focalLength: 50, bokehScale: 3, focusRange: 5 });
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    const camera = cameraRef.current;
    if (camera) {
      camera.setFocalLength(50);
      camera.lookAt(new Vector3(0, 1, 0));
    }
  }, []);

  const cameraViewDistance = (cameraRef.current?.far ?? 2000) - (cameraRef.current?.near ?? 0.1);

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      shadows
      frameloop="demand"
    >
      <ambientLight intensity={0.01} />
      <pointLight intensity={1} decay={0.3} position={[5, 30, 3]} />
      <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={[-5, 2, -8]} />
      <CameraControls enabled={false} />
      <fog attach="fog" args={['#000000', 1, 50]} />

      <color args={[0, 0, 0]} attach='background' />
      <Ground />
      <Model onLoad={setModel} />
      <ModelMovement model={model} />

      {false &&
        <EffectComposer>
          <DepthOfField
            focusDistance={dof.focusDistance / cameraViewDistance}
            focalLength={dof.focalLength}
            bokehScale={dof.bokehScale}
            focusRange={dof.focusRange / cameraViewDistance}
            target={new Vector3(0, 1, 0)}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.0001, 0.0001)}
            radialModulation={false}
            modulationOffset={1}
          />
        </EffectComposer>
      }
      <Stats />
    </Canvas>
  );
};

