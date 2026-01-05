import './HorseGalloping.css';
import { View } from '@react-three/drei';
import { usePointer } from '../../../utils/usePointer';
import React, { useRef } from 'react';
import { Muybridge } from './Muybridge';

export const HorseGalloping = () => {

  const elementRef = useRef<HTMLDivElement>(null);
  const canvasPointer$ = usePointer(elementRef);

  return (
    <>
      <div className='horse-galloping bricks-content' ref={elementRef}>
        <h2>Horse Galloping</h2>
        <p className='description'>
          A LEGO build of Eadweard Muybridge's Horse in Motion replicates his groundbreaking photographic sequence in brick form. 
          Designed with attention to detail and clever use of LEGO elements, the build highlights both the artistic and scientific significance of Muybridge’s work. 
        </p>
      </div>
      <div style={{ left: 0, top: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', position: 'absolute' }}>
        <View style={{ height: '100%', marginRight: -20 }}>
          <Muybridge pointer$={canvasPointer$} />
        </View>
      </div>
    </>
  );
};