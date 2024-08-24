import './Art.styl';

import React, { ReactNode } from 'react';
import { DragBoard } from '../../ui/drag-board/DragBoard';
import { Polaroid } from '../../effects/Polaroid';
import { PaintDragBoardItem } from './PaintDragBoardItem';
import { useDimension } from '../../utils/Dimension';
import { DragBoardItem } from '../../ui/drag-board/DragBoardItem';
import { CitroenDsLamp } from './citroen-ds-lamp/CitroenDsLamp';


export function Art() {

  const elementRef = React.useRef<HTMLDivElement>(null);
  const dimension = useDimension(elementRef, 40);

  const polaroids = [
    { title: '300 SL', src: '300sl.jpg', content: '300 SL Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Dog', src: 'dog.jpg', content: 'Dog Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
  ].map(data => [
    <div className='image-container'>
      <img {...require(`./assets/${data.src}?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} draggable={false} alt={data.title} />
    </div>,
    <div className='text-container'>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  ]) as [ReactNode, ReactNode][];

  return <div className='art' ref={elementRef}>
    <DragBoard>
      <DragBoardItem><CitroenDsLamp width={(dimension?.width ?? 400) * 0.6} height={(dimension?.height ?? 400) * 0.6} /></DragBoardItem>
      <PaintDragBoardItem width={dimension?.width ?? 400} height={dimension?.height ?? 400} />
      {polaroids.map(([image, text]) => <DragBoardItem><Polaroid>{image}{text}</Polaroid></DragBoardItem>)}
    </DragBoard>
  </div>;
}