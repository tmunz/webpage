import React, { useEffect, useRef, useState } from 'react';
import { Object3D, Vector2, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';
import { Model } from './Model';
import { EffectComposer, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from 'three';
import { Ground } from './Ground';
import { ModelMovement } from './ModelMovement';

export enum Quality {
  PERFORMANCE = 0,
  HIGH = 5,
}

export const Mb300sl = ({ animate, debug, quality = Quality.PERFORMANCE }: { animate?: boolean, debug?: boolean, quality?: Quality }) => {
  const [model, setModel] = useState<Object3D | null>(null);
  const [dof, setDof] = useState<any>({ focusDistance: 5, focalLength: 50, bokehScale: 3, focusRange: 5 });
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const elementRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const camera = cameraRef.current;
    if (camera) {
      camera.position.set(-10, 2, -12);
      camera.fov=50;
      camera.setFocalLength(50);
      camera.lookAt(new Vector3(0, 1, 0));
    }
  }, [animate, cameraRef.current, null]);

  const cameraViewDistance = (cameraRef.current?.far ?? 2000) - (cameraRef.current?.near ?? 0.1);

  return (
    <>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        ref={elementRef}
        shadows
        frameloop="demand"
      >
        <ambientLight intensity={0.01} />
        <pointLight intensity={2} decay={0.3} position={[5, 30, 3]} />
        <PerspectiveCamera ref={cameraRef} makeDefault />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.5, 0]}
        />
        <fog attach="fog" args={['#000000', 1, 25]} />

        <color args={[0, 0, 0]} attach='background' />
        <Ground />
        <Model onLoad={setModel} />
        <ModelMovement model={model} animate={animate} showPath={debug} />

        {Quality.HIGH <= quality &&
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
        {debug && <Stats />}
      </Canvas>
    </>
  );
};

