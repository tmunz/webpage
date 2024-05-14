import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { renderToString } from 'react-dom/server';

import './Photo.styl';


export function Photo() {

  const elementRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
    };
  }, []);

  const geoData = [
    { name: 'Estadio Panamericano de Cuba', location: 'Havanna', img: 'havanna', lat: 23.1382214, lng: -82.3669656 },
    { name: 'Opera House', location: 'Sydney', img: 'sydney', lat: -33.8567799, lng: 151.2127218 },
    { name: 'Emirates Towers Metro Station', location: 'Dubai', img: 'dubai', lat: 25.2173295, lng: 55.2786327 },
    { name: 'Arquipélago - Arts Center', location: 'São Miguel', img: 'arquipelago', lat: 37.8185649, lng: -25.6049037 },
    // { name: 'That Wanaka Tree', location: 'Wanaka Lake', img: 'wanaka', lat: -44.698579, lng: 169.1148488 },
    { name: 'Shooting star over Joshua Tree', location: 'Joshua Tree National Park', img: 'joshua_tree', lat: 33.9001129, lng: -116.190321 },
    { name: 'Dawn at Umpire Rock', location: 'New York', img: 'new_york', lat: 40.76924, lng: -73.9777389 },
    { name: 'Mount Cook', location: 'New Zealand', img: 'mount_cook', lat: -43.690667, lng: 170.103167 },
    // { name: 'Königsplatz', location: 'München', img: 'muenchen', lat: 48.812245, lng: 8.6475281 },
    { name: 'Arc de Triomphe de l’Étoile', location: 'Paris', img: 'paris', lat: 48.8729441, lng: 2.296929 },
    { name: 'Hummingbird', location: 'Mindo', img: 'mindo', lat: -0.0517694, lng: -78.7812344 },
  ];

  return <div ref={elementRef} className="photo">
    <Globe
      width={size.width}
      height={size.height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={require('./earth_map.jpg')}
      htmlElementsData={geoData}
      htmlElement={
        (d: any) => {
          const template = document.createElement('div');
          const innerHTML = renderToString(<div
            className="map-label"
            onClick={() => console.info(d)}
          >
            <img src={require(`./assets/${d.img}.jpg`)} alt={d.name} />
            <div className="name">{d.name}</div>
            <div className="location">{d.location}</div>
          </div>
          );
          template.insertAdjacentHTML('beforeend', innerHTML);
          return template;
        }
      } />
  </div>;
}
