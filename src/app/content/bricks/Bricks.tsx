import './Bricks.styl';
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, View, Preload, PerspectiveCamera } from '@react-three/drei';
import { BrickScroll } from './brick/BrickScroll';
import { Transformations } from '../../utils/TransformationAnimator';
import { Mb300slScroll } from './mb300sl/Mb300slScroll';
import { LoadingBrick } from './LoadingBrick';
import { useLoadable } from './useLoadable';
import { Duck, Soda } from './Models';
import { useDimension } from '../../utils/useDimension';
import { useScroll } from '../../utils/useScroll';
import { Mb300slContent } from './mb300sl/Mb300slContent';

const SECTIONS = [
  'empty',
  '',
  < View style={{ height: 300 }}>
    <color attach="background" args={["lightblue"]} />
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color="blue" />
    <Environment preset="dawn" />
    <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
    <Duck position={[0, -1, -5]}
    />
  </View >,
  <View style={{ height: 300 }}>
    <color attach="background" args={["green"]} />
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color="blue" />
    <Environment preset="dawn" />
    <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
    <Soda position={[0, -1, 1]} scale={14} />
  </View>,
  'empty',
];

const L = SECTIONS.length;

const MB_300SL_TRIGGER: [number, number] = [1.3 / L, 2.6 / L];

// key is ratio of the scrollPosition [0, 1], x/L represents the x-th section
const SCROLL_STATES: Record<string, Transformations> = {
  brick: new Map([
    [0, { rotateX: 0.25, rotateY: Math.PI / 5, scaleX: 3.2, scaleY: 3.2, scaleZ: 3.2, positionX: 0.05, positionY: -1.2, positionZ: 3 }],
    [1 / L, { rotateX: 0, rotateY: 0, positionY: 0.0 }],
    [1.3 / L, { rotateX: 0, rotateY: 0, positionY: 0.9 }],
    [0.9, { rotateX: Math.PI / 2, rotateY: Math.PI, positionX: 0, positionY: 0 }],
    [1.0, { rotateX: 0, rotateY: Math.PI * 2, positionX: 0, positionY: -1 }],
  ]),
  aircraft: new Map([
    [0.1 / L, { positionZ: 0.01 }],
    [1.0 / L, { positionY: 3 }],
  ]),
  mb300sl: new Map([
    [MB_300SL_TRIGGER[0], { positionY: 0, positionZ: 0 }],
    [MB_300SL_TRIGGER[1], { positionY: 3 }],
  ]),
};

export const Bricks = () => {

  const elementRef = useRef<HTMLDivElement>(null);
  const dimension = useDimension(elementRef);
  const scroll = useScroll(elementRef);

  console.log('scroll', scroll);

  const [loadables, loaded] = useLoadable([
    // (onLoadComplete) => <AircraftScroll transformations={SCROLL_STATES.aircraft} onLoadComplete={onLoadComplete} />,
  ]);

  return <div className='bricks'>
    {!loaded && <LoadingBrick />}

    <div
      ref={elementRef}
      style={{
        overflow: 'auto',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        width: '100%',
        height: '100%',
      }}
    >
      {SECTIONS.map((section, i) => {
        return <section key={i} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>{
          (i === 1) ?
            <>
              <Mb300slContent />
              <View style={{ height: '100%', width: '100vw', position: 'absolute', top: 0, left: 0 }}>
                <Mb300slScroll transformations={SCROLL_STATES.mb300sl} progress={scroll} animationTrigger={[MB_300SL_TRIGGER[0] - 1 / L, MB_300SL_TRIGGER[1] + 1 / L]} />
              </View>
            </>
            : section
        }</section>
      })}

      {/**************************************** overlay *******************************************/}
      <View style={{ width: dimension?.width ?? 600, height: dimension?.height ?? 800, position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <PerspectiveCamera makeDefault fov={12} position={[0, 0, 10]} />
        <BrickScroll transformations={SCROLL_STATES.brick} progress={scroll} />
        <Environment preset='sunset' />
      </View>

    </div >
    <Canvas
      style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden', zIndex: -1 }}
      eventSource={document.getElementById('poc')!}>
      <View.Port />
      <Preload all />
    </Canvas>
  </div >;
};
