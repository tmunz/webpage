import React from 'react';
import { WorldMap } from './WorldMap';

import './ImageEntry.styl';
import { Icon } from '../icon/Icon';
import { IconName } from '../icon/IconName';


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
}

export function ImageEntry({ data, active, setActive }: ImageEntryProps) {
  return (
    <div className={`image-entry ${active ? 'active' : ''}`}
      key={data.src}
    >
      <div className='image-entry-overlay'>
        <div className="control-bar">
          {data.lat && data.lng && <WorldMap data={{ lat: data.lat, lng: data.lng, name: data.location }} />}
          <div className='header'>
            <h2>{data.name}</h2>
            <div className='location'>{data.location}</div>
          </div>
          <div className='controls'>
            <button onClick={() => setActive(-1)}><Icon name={IconName.PREV}/></button>
            <button onClick={() => setActive(+1)}><Icon name={IconName.NEXT}/></button>
            <button onClick={() => setActive(null)}><Icon name={IconName.GRID}/></button>
          </div>
        </div>
        <button className='selection-overlay' onClick={() => setActive(0)} />
      </div>
      <img
        srcSet={data.srcSet}
        src={data.src}
      />
    </div>
  );
};
