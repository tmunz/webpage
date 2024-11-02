import './Bricks.styl';
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, View, Preload, PerspectiveCamera } from '@react-three/drei';
import { BrickScroll } from './brick/BrickScroll';
import { Transformations } from '../../utils/TransformationAnimator';
import { Mb300slScroll } from './mb300sl/Mb300slScroll';
import { LoadingBrick } from './LoadingBrick';
import { useLoadable } from './useLoadable';
import { useDimension } from '../../utils/useDimension';
import { useScroll } from '../../utils/useScroll';
import { Mb300slContent } from './mb300sl/Mb300slContent';
import { AircraftContent } from './aircraft/AircraftContent';

export const Bricks = () => {

  const elementRef = useRef<HTMLDivElement>(null);
  const dimension = useDimension(elementRef);
  const scroll = useScroll(elementRef);

  const sections = [
    { height: 1, content: null },
    { height: 3, content: undefined }, // Placeholder for the 300 SL,
    {
      height: 1, content: <>
        <div style={{ paddingTop: '20px' }}>
          <AircraftContent />
        </div>
        <div style={{ left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', position: 'absolute' }}>
          <View style={{ height: '100%', marginRight: -20 }}>
            <color attach='background' args={['rgb(255, 0, 0)']} />
            <ambientLight intensity={0.5} />
            <pointLight position={[20, 30, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} color='blue' />
            <Environment preset='dawn' />
            <PerspectiveCamera makeDefault fov={50} position={[0, 0, -6]} />
          </View>
        </div>
      </>
    },
    { height: 1, content: null },
  ];
  const pages = sections.reduce((acc, { height }) => acc + height, 0);
  const mb300slTriggers: [number, number] = [1.3 / pages, 3.6 / pages];

  const [loadables, loaded] = useLoadable([(onLoadComplete) => ((scrollProgress: number) => <Mb300slScroll
    progress={scrollProgress}
    animationTrigger={[mb300slTriggers[0] - 1 / pages, mb300slTriggers[1] + 1 / pages]}
    onLoadComplete={onLoadComplete}
  />)]);

  sections[1].content = <>
    <div style={{ position: 'absolute', top: '50vh' }}>
      <Mb300slContent />
    </div>
    <div style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <View style={{ height: '100vh', position: 'absolute', top: 0, left: 0, right: -20 }}>
        {loadables[0](scroll)}
      </View>
    </div>
  </>;


  const scrollStates: Record<string, Transformations> = {
    brick: new Map([
      [0, { rotateX: 0.25, rotateY: Math.PI / 5, scaleX: 2.5, scaleY: 2.5, scaleZ: 2.5, positionX: 0.05, positionY: -1, positionZ: 0 }],
      [1 / pages, { rotateX: 0, rotateY: 0, positionY: 0 }],
      [1.3 / pages, { positionY: 0.9 }],
      [3.5 / pages, { positionY: 0.9 }],
      [4.5 / pages, { rotateX: Math.PI / 2, rotateY: Math.PI, positionY: 0 }],
      [Math.max(0.9, 5 / pages), { rotateX: 0, rotateY: Math.PI * 2, positionX: 0, positionY: -1 }],
    ]),
  };

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
      {sections.map((section, i) => {
        return <section key={i} style={{ minHeight: `${section.height * 100}vh`, top: 0, position: 'relative' }}>
          {section.content}
        </section>
      })}

      {/**************************************** brick overlay *******************************************/}
      <View style={{ width: dimension?.width ?? 600, height: dimension?.height ?? 800, position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
        {/* <ambientLight intensity={0.1} /> */}
        {/* <directionalLight position={[10, 10, 5]} intensity={1} color={[1, 0, 0]} /> */}
        <PerspectiveCamera makeDefault fov={12} position={[0, 0, 5]} />
        <BrickScroll transformations={scrollStates.brick} progress={scroll} />
        <Environment preset='lobby' />
      </View>
    </div>

    <Canvas
      style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden', zIndex: -1 }}
      eventSource={document.getElementById('poc')!}>
      <View.Port />
      <Preload all />
    </Canvas>
  </div >;
};
