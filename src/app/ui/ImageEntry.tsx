import React from 'react';
import { WorldMap } from '../visualization/WorldMap';

import './ImageEntry.styl';
import { Icon } from './icon/Icon';
import { IconName } from './icon/IconName';
import CloseButton from './CloseButton';


interface ImageEntryProps {
  data: ImageData;
  active?: boolean;
  setActive: (deltaIndex: number | null) => void;
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

export function ImageEntry({ data, active, setActive }: ImageEntryProps) {
  return (
    <div
      className={`image-entry ${active ? 'active' : ''}`}
      key={data.src}
      style={{ width: data.width, height: data.height }}
    >
      <div className='image-entry-overlay'>
        <div className="control-bar">
          {data.lat && data.lng && <WorldMap data={{ lat: data.lat, lng: data.lng, name: data.location }} />}
          <div className='header'>
            <h2>{data.name}</h2>
            <div className='location'>{data.location}</div>
          </div>
          <div className='controls'>
            <button onClick={() => setActive(-1)}><Icon name={IconName.PREV} /></button>
            <button onClick={() => setActive(+1)}><Icon name={IconName.NEXT} /></button>
          </div>
        </div>
        <CloseButton onClick={() => setActive(active ? null : 0)} active={ active } />
      </div>
      <img
        srcSet={data.srcSet}
        src={data.src}
      />
    </div>
  );
};
