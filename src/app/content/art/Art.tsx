import React from 'react';
import { ImageGallery } from '../../ui/ImageGallery';

import './Art.styl';

export function Art() {

  const images = [
    { id: '300sl', name: '300 SL' },
    { id: 'dog', name: 'Dog' },
    { id: 'citroen_ds_lamp', name: 'Citroen DS Lamp' },
  ];

  return <div className="art">
    <ImageGallery data={images.map(img => require(`./assets/${img.id}.jpg?{sizes:[200, 400, 720, 1200, 2000], format: "webp"}`))} />
  </div>;
}