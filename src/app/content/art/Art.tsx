import React from 'react';
import { Portfolio } from '../../ui/Portfolio';

import './Art.styl';


export function Art() {

  const items = [
    { title: '300 SL', src: '300sl', content: '300 SL Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Dog', src: 'dog', content: 'Dog Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
    { title: 'Citroen DS Lamp', src: 'citroen_ds_lamp', content: 'Citroen DS Lamp Lorem ipsum eofwpfo f kweopf kweopf kweof kowe foewp fkweop fk owefko ewfkop weofk ewof ewf kwfopewfkeowf kewo fkweo fkowe kofw eopf weopfkwef kwepfo ewopfk eowpf kep weopfk kweop' },
  ].map(data => ({ title: data.title, img: require(`./assets/${data.src}.jpg?{sizes:[200, 400, 720, 1200, 2000], format: "webp"}`), content: data.content }));

  return <div className="art">
    <Portfolio items={[...items, ...items, ...items, ...items, ...items, ...items]} />
  </div>;
}