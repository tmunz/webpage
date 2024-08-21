import './Photo.styl';

import React, { useRef } from 'react';
import { ImageGallery } from '../../ui/image-gallery/ImageGallery';


export function Photo() {

  const elementRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      title: 'Architecture',
      data: [
        { name: 'Estadio Panamericano de Cuba', location: 'Havanna', src: 'havanna', lat: 23.1382214, lng: -82.3669656 },
        { name: 'Opera House', location: 'Sydney', src: 'sydney', lat: -33.8567799, lng: 151.2127218 },
        { name: 'Arquipélago - Arts Center', location: 'São Miguel', src: 'arquipelago', lat: 37.8185649, lng: -25.6049037 },
        { name: 'Emirates Towers Metro Station', location: 'Dubai', src: 'dubai', lat: 25.2173295, lng: 55.2786327 },
        { name: 'Königsplatz', location: 'München', src: 'muenchen', lat: 48.812245, lng: 8.6475281 },
        { name: 'Arc de Triomphe de l’Étoile', location: 'Paris', src: 'paris', lat: 48.8729441, lng: 2.296929 },
      ]
    },
    {
      title: 'Landscape',
      data: [
        { name: 'That Wanaka Tree', location: 'Wanaka Lake', src: 'wanaka', lat: -44.698579, lng: 169.1148488 },
        { name: 'Shooting star over Joshua Tree', location: 'Joshua Tree National Park', src: 'joshua_tree', lat: 33.9001129, lng: -116.190321 },
        { name: 'Dawn at Umpire Rock', location: 'New York', src: 'new_york', lat: 40.76924, lng: -73.9777389 },
        { name: 'Mount Cook', location: 'New Zealand', src: 'mount_cook', lat: -43.690667, lng: 170.103167 },
      ]
    }
  ];
  // { name: 'Hummingbird', location: 'Mindo', src: 'mindo', lat: -0.0517694, lng: -78.7812344 },

  return <div ref={elementRef} className="photo">
    <ImageGallery sections={sections.map(section => (
      { title: section.title, data: section.data.map(img => ({ ...img, ...require(`./assets/${img.src}.jpg?{sizes:[200, 400, 720, 1200, 2000], format: "webp"}`) })) })
    )} />
  </div>;
}
