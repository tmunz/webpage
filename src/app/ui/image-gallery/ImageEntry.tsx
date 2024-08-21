import './ImageEntry.styl';

import React, { useEffect, useState } from 'react';
import { WorldMap } from '../../visualization/WorldMap';

interface ImageEntryProps {
  data: ImageData;
  active?: boolean;
  onLoaded?: (width: number, height: number) => void;
  delay?: number;
  hideInfo?: boolean;
}

export interface ImageData {
  srcSet: string;
  src: string;
  name: string;
  location?: string;
  lat?: number;
  lng?: number;
  width?: number;
  height?: number;
}

export function ImageEntry({ data, active, onLoaded, hideInfo, delay = 0 }: ImageEntryProps) {

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = data.srcSet.split(' ')[0]; // use smallest, asuming it is the first
    img.onload = () => setTimeout(() => setLoaded(() => {
      if (onLoaded && !loaded) { onLoaded(img.width, img.height); }
      return true;
    }), delay);
  }, [data.srcSet, onLoaded]);

  return (
    <div
      className={`image-entry ${active ? 'active' : ''} ${!loaded ? 'loading' : ''}`}
      style={{ width: data.width, height: data.height }}
    >
      <div className='image-entry-overlay'>
        <div className={`info-bar ${hideInfo ? 'hide-info' : ''}`}>
          {data.lat && data.lng && <WorldMap data={{ lat: data.lat, lng: data.lng, name: data.location }} />}
          <div className='header'>
            <h2>{data.name}</h2>
            <div className='location'>{data.location}</div>
          </div>
        </div>
      </div>
      <img
        className={`image-entry-img`}
        srcSet={data.srcSet}
        src={data.src}
      />
    </div>
  );
};
