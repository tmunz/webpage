import React, { useRef, useEffect, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, AnimationClip, Mesh, MeshBasicMaterial, Color, Group, PointLight } from 'three';
import { useLoader } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Model = ({ onLoad }: { onLoad: (model: Object3D) => void }) => {
  const modelRef = useRef<Group>(null);
  const headlightTargetRef = useRef<Mesh>(null);

  const file = useLoader(GLTFLoader, require('./assets/mb_300sl.glb')) as unknown as { scene: Object3D, animations: AnimationClip[] };
  const white = new Color(0xffffff);
  const red = new Color(0xff6666);
  // const chrome = new MeshMatcapMaterial({ matcap: useMatcapTexture("C7C7D7_4C4E5A_818393_6C6C74")[0] });

  const model = useMemo(() => {
    const m = file.scene;
    m.traverse((child) => {
      const m = child as Mesh;
      // if ((((child as Mesh)?.material) as MeshStandardMaterial)?.color?.equals(white)) {
      //   (child as Mesh).material = chrome;
      // }

      if (m.name.startsWith('4740dat')) {
        m.material = new MeshBasicMaterial({ color: white });
      } else if ((m.material as any)?.name === '36 Trans_Red') {
        m.material = new MeshBasicMaterial({ color: red });
      }
    });

    return m
  }, [file]);

  useEffect(() => {
    if (onLoad && file.scene && modelRef.current) {
      onLoad(modelRef.current);
    }
  }, [file, onLoad, modelRef.current]);

  const headlightTarget = headlightTargetRef.current!;

  return (
    <group ref={modelRef} visible={false}>
      <mesh position={[0, 0, -1000]} ref={headlightTargetRef}/>
      {
        file.scene && headlightTarget && <>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <primitive object={model} />
            <EffectComposer>
              <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.1} opacity={0.2} />
            </EffectComposer>
          </mesh>
          {[-1.35, 1.35].map((x, i) => (
            <SpotLight
              key={i}
              position={[x, 1.2, -3.9]}
              target={headlightTarget}
              color={'#ffffee'}
              radiusTop={0.2}
              castShadow
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
              castShadow
              distance={5}
              intensity={0.5}
            />
          ))}
        </>
      }
    </group >
  );
};
