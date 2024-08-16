import './Art.styl';

import React, { ReactNode, useState } from 'react';
import { FlipList } from '../../effects/FlipList';
import { PaperFolding } from '../../effects/PaperFolding';
import { OilPaintingWithControls } from '../../ui/oil-painting/OilPaintingWithControls';
import { PaperEffect } from '../../effects/PaperEffect';


export function Art() {

  const [paintYourself, setPaintYourself] = useState(false);

  const items = [
    { title: '300 SL', src: '300sl.jpg', content: '300 SL Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Dog', src: 'dog.jpg', content: 'Dog Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Citroen DS Lamp', src: 'citroen_ds_lamp.png', content: 'Citroen DS Lamp Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
  ].map(data => [
    <PaperEffect key={data.title} seed={data.title}>
      <div className='image-container'>
        <img {...require(`./assets/${data.src}?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} alt={data.title} />
      </div>
    </PaperEffect>,
    <PaperEffect key={data.title} seed={data.title + '1'}>
      <div className='text-container'>
        <h3>{data.title}</h3>
        <p>{data.content}</p>
      </div>
    </PaperEffect>
  ]) as [ReactNode, ReactNode][];

  return <div className='art'>
    <div className={`paint-yourself ${paintYourself ? 'active' : ''}`}>
      <PaperFolding onUnfold={() => setPaintYourself(true)} onInfold={() => setPaintYourself(false)}>
        <OilPaintingWithControls />
      </PaperFolding>
    </div>
    <div className='paint-yourself-hint'>
      Paint your own masterpiece
      <svg width='500' height='500' style={{ transform: `translate(-70%, -150px) scale(0.2, -0.2) rotate(140deg)` }}>
        <path d='M414.937,374.984c-7.956-24.479-20.196-47.736-30.601-70.992c-1.224-3.06-6.12-3.06-7.956-1.224 c-10.403,11.016-22.031,22.032-28.764,35.496h-0.612c-74.664,5.508-146.88-58.141-198.288-104.652 c-59.364-53.244-113.22-118.116-134.64-195.84c-1.224-9.792-2.448-20.196-2.448-30.6c0-4.896-6.732-4.896-7.344,0 c0,1.836,0,3.672,0,5.508C1.836,12.68,0,14.516,0,17.576c0.612,6.732,2.448,13.464,3.672,20.196 C8.568,203.624,173.808,363.356,335.376,373.76c-5.508,9.792-10.403,20.195-16.523,29.988c-3.061,4.283,1.836,8.567,6.12,7.955 c30.6-4.283,58.14-18.972,86.292-29.987C413.712,381.104,416.16,378.656,414.937,374.984z M332.928,399.464 c3.673-7.956,6.12-15.912,10.404-23.868c1.225-3.061-0.612-5.508-2.448-6.12c0-1.836-1.224-3.061-3.06-3.672 c-146.268-24.48-264.996-124.236-309.06-259.489c28.764,53.244,72.828,99.756,116.28,138.924 c31.824,28.765,65.484,54.468,102.204,75.888c28.764,16.524,64.872,31.824,97.92,21.421l0,0c-1.836,4.896,5.508,7.344,7.956,3.672 c7.956-10.404,15.912-20.196,24.48-29.376c8.567,18.972,17.748,37.943,24.479,57.527 C379.44,382.94,356.796,393.956,332.928,399.464z' />
      </svg>
    </div>
    <FlipList items={[...items, ...items, ...items, ...items, ...items, ...items]} />
  </div>;
}