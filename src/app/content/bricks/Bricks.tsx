import './Bricks.styl';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Environment, Scroll, Html } from '@react-three/drei';
import { BrickScroll } from './brick/BrickScroll';
import { Transformations } from '../../utils/TransformationAnimator';
import { Mb300slScroll } from './mb300sl/Mb300slScroll';
import { AircraftScroll } from './aircraft/AircraftScroll';
import { LoadingBrick } from './LoadingBrick';
import { useLoadable } from './useLoadable';
import { Mb300slContent } from './mb300sl/Mb300slContent';

type TransformableObject = 'brick' | 'mb300sl' | 'aircraft';

const SCROLL_STATES: Record<TransformableObject, Transformations> = {
  brick: new Map([
    [0.03, { rotateX: 0.25, rotateY: Math.PI / 5, scaleX: 4, scaleY: 4, scaleZ: 4, positionX: 0.1, positionY: -1.8, positionZ: 2 }],
    [0.13, { rotateX: 0, rotateY: 0, positionY: 1.25 }],
    [0.73, { rotateX: Math.PI / 2, rotateY: Math.PI, positionX: 0, positionY: 0 }],
    [1.0, { rotateX: 0, rotateY: Math.PI * 2, positionX: 0, positionY: -1 }],
  ]),
  aircraft: new Map([
    [0.05, { positionZ: 0.01 }],
    [0.09, { positionY: 3 }],
  ]),
  mb300sl: new Map([
    [0.15, { positionY: 0, positionZ: 0 }],
    [0.21, { positionY: 3 }],
  ]),
};

const SECTIONS = [
  'empty',
  <Mb300slContent />,
  'aircraft content',
  'empty',
  'empty',
]



export function Bricks() {

  const [loadables, loaded] = useLoadable([
    (onLoadComplete) => <BrickScroll transformations={SCROLL_STATES.brick} onLoadComplete={onLoadComplete} />,
    (onLoadComplete) => <Mb300slScroll transformations={SCROLL_STATES.mb300sl} onLoadComplete={onLoadComplete} />,
    // (onLoadComplete) => <AircraftScroll transformations={SCROLL_STATES.aircraft} onLoadComplete={onLoadComplete} />,
  ]);

  return (
    <div className='bricks'>
      {!loaded && <LoadingBrick />}

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          width: '100%',
          height: '100%',
        }}
      >
        <Canvas camera={{ position: [0, 0, 9], fov: 14 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <ScrollControls pages={SECTIONS.length} damping={0.5}>
            {loadables}
            <Scroll html>
              {SECTIONS.map((section, i) => (
                <section style={{
                  marginTop: 40,
                  height: '100vh',
                  width: '100vw',
                  background: i % 2 ? 'rgba(0, 0, 0, 0.1)' : 'none',
                  pointerEvents: 'none',
                }}>
                  {section}
                </section>
              ))}
            </Scroll>
          </ScrollControls>
          <Environment preset='sunset' />
        </Canvas>
      </div>
    </div>
  );
}

