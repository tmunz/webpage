import './Bricks.styl';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Environment, Scroll, Html } from '@react-three/drei';
import { BrickScroll } from './brick/BrickScroll';
import { Transformations } from '../../utils/TransformationAnimator';
import { Mb300slScroll } from './mb300sl/Mb300slScroll';
import { AircraftScroll } from './aircraft/AircraftScroll';

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

const PAGES = 3;

export function Bricks() {
  return (
    <div className='bricks'>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 14 }}
      //   shadows
      //   frameloop="demand"
      //   gl={{ logarithmicDepthBuffer: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ScrollControls pages={PAGES} damping={0.5}>
          <BrickScroll transformations={SCROLL_STATES.brick} />
          <AircraftScroll transformations={SCROLL_STATES.aircraft} />
          <Mb300slScroll transformations={SCROLL_STATES.mb300sl} />
          <Scroll>
            {new Array(PAGES + 1).fill(0).map((_, i) => (
              <Html
                key={i}
                position={[0, -i * PAGES, 0]}
                style={{ height: '90vh', width: '90vw', transform: 'translate(-50%, -50%)', background: i % 2 ? 'rgba(0, 0, 0, 0.1)' : 'none' }}
              >
                <section>
                  <h1>Page {i + 1}</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
                  <p>Curabitur sit amet felis elit. In sit amet venenatis ligula. Proin tincidunt luctus dui, sit amet faucibus felis laoreet sed.</p>
                </section>
              </Html>
            ))}
          </Scroll>
        </ScrollControls>
      
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}