import './PhotoEntry.styl';
import React from "react";
import { FilmStrip } from '../../effects/FilmStrip';
import { RgbaFilter } from '../../effects/RgbaFilter';
import { PhotoMetaData } from './PhotoMetaData';

export const PhotoEntry = ({ photo }: { photo: PhotoMetaData }) => {

  return (
    <div className='photo-entry'>
      <img className='photo-entry-main' src={photo.src} alt={photo.name} />
      <div className='filter'>
        <FilmStrip label={[photo.camera, photo.iso].filter(e => !!e).join(' -- ')} />
        <RgbaFilter g={0} b={0}><img className='rgba-image r' src={photo.src} alt="Red Channel" /></RgbaFilter>
        <RgbaFilter r={0} b={0}><img className='rgba-image g' src={photo.src} alt="Green Channel" /></RgbaFilter>
        <RgbaFilter r={0} g={0}><img className='rgba-image b' src={photo.src} alt="Blue Channel" /></RgbaFilter>
      </div>
    </div>
  );
};
