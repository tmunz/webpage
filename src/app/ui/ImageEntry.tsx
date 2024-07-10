import React, { useEffect, useRef, useState } from 'react';
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

  const [userAction, setUserAction] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleUserAction = (e: MouseEvent | KeyboardEvent | TouchEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setUserAction(true);
      timeoutRef.current = window.setTimeout(() => {
        setUserAction(false);
      }, 2500);

      if (active && e instanceof KeyboardEvent) {
        console.log(e, e.key);
        if (e.key === 'ArrowRight') {
          setActive(+1);
        } else if (e.key === 'ArrowLeft') {
          setActive(-1);
        } else if (e.key === 'Escape') {
          setActive(null);
        }
      }
    };

    document.addEventListener('click', handleUserAction);
    document.addEventListener('mousemove', handleUserAction);
    document.addEventListener('keydown', handleUserAction);
    document.addEventListener('touchstart', handleUserAction);


    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('click', handleUserAction);
      document.removeEventListener('mousemove', handleUserAction);
      document.removeEventListener('keydown', handleUserAction);
      document.removeEventListener('touchstart', handleUserAction);
    };
  }, [active]);


  return (
    <div
      className={`image-entry ${active ? 'active' : ''}`}
      key={data.src}
      style={{ width: data.width, height: data.height }}
    >
      <div className={`image-entry-overlay ${userAction ? 'user-action' : ''}`}>
        <div className="info-bar">
          {data.lat && data.lng && <WorldMap data={{ lat: data.lat, lng: data.lng, name: data.location }} />}
          <div className='header'>
            <h2>{data.name}</h2>
            <div className='location'>{data.location}</div>
          </div>
        </div>
        <button className="prev-button control-button" onClick={() => setActive(-1)}><Icon name={IconName.PREV} /></button>
        <button className="next-button control-button" onClick={() => setActive(+1)}><Icon name={IconName.NEXT} /></button>
        <CloseButton className="control-button" onClick={() => setActive(active ? null : 0)} active={active} />
      </div>
      <img
        srcSet={data.srcSet}
        src={data.src}
      />
    </div>
  );
};
