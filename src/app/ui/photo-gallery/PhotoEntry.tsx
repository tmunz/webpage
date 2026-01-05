import './PhotoEntry.css';
import React from "react";
import { FilmStrip } from '../../effects/FilmStrip';
import { RgbaFilter } from '../../effects/RgbaFilter';
import { PhotoMetaData } from './PhotoMetaData';
import { PhotoButton } from './PhotoButton';
import { WorldMap } from '../../visualization/WorldMap';

interface PhotoEntryProps {
  photo: PhotoMetaData;
  active: boolean;
  onClick: (active: boolean) => void;
  userAction: boolean;
}

export const PhotoEntry = ({ photo, active, onClick, userAction }: PhotoEntryProps) => {

  return (
    <div className={`photo-entry ${active ? 'active' : ''}`}>
      <div className='photo-entry-main'>
        <img src={photo.src} alt={photo.name} />
        <PhotoButton active={active} onClick={onClick} userAction={userAction} />
      </div>
      <div className='filter'>
        <FilmStrip label={[photo.camera, photo.iso].filter(e => !!e).join(' -- ')}>
          {active && photo.lat && photo.lng && <WorldMap data={{ lat: photo.lat, lng: photo.lng, name: photo.location }} />}
        </FilmStrip>
        <RgbaFilter g={0} b={0}><img className='rgba-image r' src={photo.src} alt="Red Channel" /></RgbaFilter>
        <RgbaFilter r={0} b={0}><img className='rgba-image g' src={photo.src} alt="Green Channel" /></RgbaFilter>
        <RgbaFilter r={0} g={0}><img className='rgba-image b' src={photo.src} alt="Blue Channel" /></RgbaFilter>
      </div>
    </div>
  );
};
