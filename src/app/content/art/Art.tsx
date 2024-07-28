import React from 'react';
import { ImageGallery } from '../../ui/ImageGallery';

import './Art.styl';

export function Art() {

  const sections = [
    {
      title: 'Art', data: [
        { src: '300sl', title: '300 SL' },
        { src: 'dog', title: 'Dog' },
      ]
    }, {
      title: 'Design', data: [
        { src: 'citroen_ds_lamp', title: 'Citroen DS Lamp' },
      ]
    }
  ].map(section => ({ ...section, data: section.data.map(d => ({ ...d, ...require(`./assets/${d.src}.jpg?{sizes:[200, 400, 720, 1200, 2000], format: "webp"}`) })) }));

  return <div className="art">
    <ImageGallery sections={sections} />
  </div>;
}