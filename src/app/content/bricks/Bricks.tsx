import './Bricks.styl';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Environment, Html } from '@react-three/drei';
import { BrickScroll } from './brick/BrickScroll';
import { Transformations } from '../../utils/TransformationAnimator';
import { Mb300slScroll } from './mb300sl/Mb300slScroll';

type TransformableObject = 'brick' | 'mb300sl';

const SCROLL_STATES: Record<TransformableObject, Transformations> = {
  brick: new Map([
    [0.0, { rotateX: 0.25, rotateY: Math.PI / 5, scaleX: 4, scaleY: 4, scaleZ: 4, positionX: 0.1, positionY: -1.25, positionZ: 0 }],
    [0.1, { rotateX: 0, rotateY: 0, positionY: 1.25 }],
    [0.7, { rotateX: Math.PI / 2, rotateY: Math.PI, positionX: 0, positionY: 0 }],
    [1.0, { rotateX: 0, rotateY: Math.PI * 2, positionX: 0, positionY: -1 }],
  ]),
  mb300sl: new Map([
    [0.09, { positionZ: -2 }],
    [0.12, { positionY: 3 }],
  ]),
};

const PAGES = 3;

export function Bricks() {
  return (
    <div className='bricks'>
      <Canvas camera={{ position: [0, 0, 10], fov: 10 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ScrollControls pages={PAGES} damping={0.5}>
          <BrickScroll transformations={SCROLL_STATES.brick} />
          <Mb300slScroll transformations={SCROLL_STATES.mb300sl} />
          <Scroll>
            {new Array(PAGES + 1).fill(0).map((_, i) => (
              <Html
                key={i}
                position={[0, -i * 4, 0]}
                style={{ height: '100vh', width: '100vw', transform: 'translate(-50%, -50%)', padding: '50px', background: i % 2 ? 'rgba(0, 0, 0, 0.1)' : 'none' }}
              >
                <section>
                  <h1>Page {i + 1}</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
                  <p>Curabitur sit amet felis elit. In sit amet venenatis ligula. Proin tincidunt luctus dui, sit amet faucibus felis laoreet sed.</p>
                </section>
              </Html>
            )
            )}
          </Scroll>
        </ScrollControls>
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}