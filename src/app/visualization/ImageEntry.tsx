import React from 'react';
import { renderToString } from 'react-dom/server';
import Globe from 'react-globe.gl';

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

  const size = { width: 200, height: 200 };

  return (
    <div className={`image-entry ${active ? 'active' : ''}`}
      onClick={() => onClick(!active ?? true)}
      key={data.src}
    >
      <img
        srcSet={data.srcSet}
        src={data.src}
      />
      {active && <Globe
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={require('./earth_map.jpg').src}
        htmlElementsData={[data]}
        htmlElement={
          (d: any) => {
            const template = document.createElement('div');
            //  img = require(`./assets/${d.img}.jpg?{sizes:[120,380,800,1280], format: "webp"}`);
            const innerHTML = renderToString(<div
              className="map-label"
              onClick={() => console.info(d)}
            >
              {/*<img
                src={img.src}
                srcSet={img.srcSet}
                alt={d.name}
              />*/}
              <div className="name">{d.name}</div>
              <div className="location">{d.location}</div>
            </div>
            );
            template.insertAdjacentHTML('beforeend', innerHTML);
            return template;
          }
        } />
      }
    </div>
  );
};
