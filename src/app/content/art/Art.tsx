import './Art.styl';

import React, { ReactNode, useState } from 'react';
import { FlipList } from '../../effects/FlipList';
import { PaperFolding } from '../../effects/PaperFolding';
import { OilPaintingWithControls } from '../../ui/oil-painting/OilPaintingWithControls';
import { PaperEffect } from '../../effects/PaperEffect';
import { MoveBoard } from '../../effects/MoveBoard';
import { Polaroid } from '../../effects/Polaroid';


export function Art() {

  const [paintYourself, setPaintYourself] = useState(false);

  const items = [
    { title: '300 SL', src: '300sl.jpg', content: '300 SL Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Dog', src: 'dog.jpg', content: 'Dog Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Citroen DS Lamp', src: 'citroen_ds_lamp.png', content: 'Citroen DS Lamp Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
  ].map(data => [
    <div className='image-container'>
      <img {...require(`./assets/${data.src}?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} alt={data.title} />
    </div>,
    <div className='text-container'>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  ]) as [ReactNode, ReactNode][];

  return <div className='art'>
    <MoveBoard>
      {items.map(([image, text]) => <Polaroid>{image}{text}</Polaroid>)}
    </MoveBoard>
    <div className={`paint-yourself ${paintYourself ? 'active' : ''}`}>
      <PaperFolding onUnfold={() => setPaintYourself(true)} onInfold={() => setPaintYourself(false)}>
        <OilPaintingWithControls />
      </PaperFolding>
    </div>
  </div>;
}