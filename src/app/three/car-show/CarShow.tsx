import React, { FC, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Object3D, PerspectiveCamera as Camera, Vector3 } from 'three';
import { ContactShadows, OrbitControls, Stats, PerspectiveCamera } from '@react-three/drei';
import { Ground } from './Ground';
import { ModelMovement } from './ModelMovement';
import { Effects } from './Effects';
import { CarShowModelProps } from './CarShowModelProps';
import { AutoQuality, Quality, QualityContext } from '../QualityProvider';

interface CarShowProps {
  animate?: boolean;
  debug?: boolean;
  quality?: Quality;
  Model: FC<CarShowModelProps>;
  controls?: boolean;
  onLoadComplete?: () => void;
}

export const CarShow = forwardRef(({ animate, debug, Model, quality = Quality.LOW, controls = true, onLoadComplete }: CarShowProps, ref) => {
  const [model, setModel] = useState<Object3D | null>(null);
  const cameraRef = useRef<Camera>(null);
  const controlsRef = useRef(null);
  const { current: center } = useRef(new Vector3(0, 1.5, 0));
  const { current: defaultDimensions } = useRef(new Vector3(2, 2.5, 5.5));

  useImperativeHandle(ref, () => ({
    controls: controlsRef.current
  }));

  useEffect(() => {
    const camera = cameraRef.current;
    if (camera) {
      camera.position.set(-10, 2, -12);
      camera.setFocalLength(40);
      camera.lookAt(center);
    }
  }, [animate]);

  return (
    <>
      <ambientLight intensity={0.01} />
      <pointLight intensity={2} decay={0.3} position={[5, 30, 3]} />
      <PerspectiveCamera ref={cameraRef} makeDefault />
      <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} />
      <fog attach="fog" args={['#000000', 1, 25]} />
      <color args={[0, 0, 0]} attach="background" />
      <Ground />

      <Model onLoadComplete={(model) => {
        setModel(model);
        onLoadComplete?.();
      }} />
      <ModelMovement model={model} animate={animate} showPath={debug} />
      
      <OrbitControls
        ref={controlsRef}
        enableRotate={controls}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={center}
      />

      {false && <AutoQuality forceQuality={quality}>
        <QualityContext.Consumer>{
          renderQuality => <Effects camera={cameraRef.current} quality={renderQuality} debug={debug} focus={{ position: model?.position ?? center, dimensions: defaultDimensions }} />
        }</QualityContext.Consumer>
      </AutoQuality>}

      {debug && <Stats />}
    </>
  );
});
