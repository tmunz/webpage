import * as THREE from 'three';
import React, { forwardRef, Suspense, useEffect, useRef, useState } from 'react';
import { PerspectiveCamera, MeshReflectorMaterial, useGLTF } from '@react-three/drei';
import { Object3D, RepeatWrapping, TextureLoader, Vector2 } from 'three';
import { Object3DProps, useFrame, useLoader } from '@react-three/fiber';
import { BehaviorSubject } from 'rxjs';
import { Pointer } from '../../../utils/usePointer';

const CAMERA_POSITION = new THREE.Vector3(-1, 0, 7);

export const Muybridge = ({ pointer$ }: { pointer$: BehaviorSubject<Pointer> }) => {

  const { current: vec } = useRef(new THREE.Vector3());
  useFrame((state) => {
    const {cx, cy } = pointer$.getValue();
    state.camera.position.lerp(vec.set(-1 + cx * -1, 1 + cy * 1, 8), 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach='background' args={['black']} />
      <fog attach='fog' args={['black', 10, 12]} />
      <PerspectiveCamera makeDefault fov={15} position={[0, 3, 100]} />
      <Suspense fallback={null}>
        <group position={[-0.5, -1.2, 0]}>
          <Carla position={[-0.5, 0, 0]} rotation={[0, Math.PI - 0.4, 0]} scale={[0.2, 0.2, 0.2]} />
          <Screen position={[1, 1.1, -2]} rotation={[0, -0.2, 0]} scale={[0.2, 0.2, 0.2]} />
          <Ground />
        </group>
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 2, 0]} intensity={0.3} />
        <directionalLight position={[-1, 0, -1]} intensity={0.7} />
        <PerspectiveCamera makeDefault fov={30} position={CAMERA_POSITION} near={0.01} far={12} />
      </Suspense>
    </>
  );
}

const Carla = (props: Object3DProps) => {
  //const file = useLoader(GLTFLoader, require('./carla-draco.glb')) as unknown as { scene: Object3D };
  const file = useGLTF(require('./carla-draco.glb')) as unknown as { scene: Object3D };
  return <primitive object={file.scene} {...props} />;
}

const Emitter = forwardRef((props, forwardRef) => {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: require('./galloping-lego.mp4'), loop: true, muted: true }));
  useEffect(() => void video.play(), [video]);
  return (
    <mesh ref={forwardRef as any} {...props}>
      <planeGeometry args={[16, 10]} />
      <meshBasicMaterial>
        <videoTexture attach='map' args={[video]} colorSpace={THREE.SRGBColorSpace} />
      </meshBasicMaterial>
      <mesh scale={[16, 11, 1]} position={[0, 0, -0.01]}>
        <planeGeometry />
        <meshBasicMaterial color='black' />
      </mesh>
    </mesh>
  );
})

function Screen(props: any) {
  const [material, set] = useState()
  return (
    <>
      <Emitter ref={set} {...props} />
      {/* {material && (
        <EffectComposer disableNormalPass multisampling={8}>
          <GodRays sun={material} exposure={0.34} decay={0.8} blur />
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
        </EffectComposer>
      )} */}
    </>
  )
}

const Ground = () => {
  const [roughness, normal] = useLoader(TextureLoader, [
    require('./ground.jpg'),
    require('./ground-normal.jpg'),
  ]);

  useEffect(() => {
    [normal, roughness].forEach((t) => {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat.set(5, 5);
      t.offset.set(0, 0);
    });
  }, [normal, roughness]);

  return (
    <mesh rotation-x={-Math.PI * 0.5} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        envMapIntensity={100}
        // normalMap={normal}
        normalScale={new Vector2(0.15, 0.15)}
        roughnessMap={roughness}
        dithering
        color={[0.015, 0.015, 0.015]}
        roughness={0.7}
        blur={[100, 40]} // Blur ground reflections (width, heigt), 0 skips blur
        mixBlur={30} // How much blur mixes with surface roughness (default = 1)
        mixStrength={80} // Strength of the reflections
        mixContrast={1} // Contrast of the reflections
        resolution={512} // Off-buffer resolution, lower=faster, higher=better quality, slower
        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
        depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
        reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
      />
    </mesh>
  );
}
