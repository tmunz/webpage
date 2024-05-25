import React from 'react';
import { WorldMap } from './WorldMap';

import './ImageEntry.styl';


interface ImageEntryProps {
  data: ImageData;
  active?: boolean;
  onClick: (activate: boolean) => void;
}

export interface ImageData {
  srcSet: string;
  src: string;
  name: string;
  location?: string;
  lat?: number;
  lng?: number;
}

export function ImageEntry({ data, active, onClick }: ImageEntryProps) {
  return (
    <div className={`image-entry ${active ? 'active' : ''}`}
      onClick={() => onClick(!active ?? true)}
      key={data.src}
    >
      <div className="control-bar">
        {data.lat && data.lng && <WorldMap data={{ lat: data.lat, lng: data.lng, name: data.location }} />}
      </div>
      <img
        srcSet={data.srcSet}
        src={data.src}
      />
    </div>
  );
};
