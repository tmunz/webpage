import './Mb300slPainting.styl';
import React from 'react';
import { Taped } from '../../../effects/Taped';
import { PaintingCanvas } from '../../../effects/PaintingCanvas';
import { WebpImage } from '../../../ui/WebpImage';


export function Mb300slPainting({ width }: { width: number }) {

  return (
    <PaintingCanvas className='mb-300sl-painting'>
      <WebpImage src={require(`./300sl.jpg?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} alt='300sl painting' style={{ width, height: 'auto' }} />
      <div className='text-container'>
        <h3>Would you like to own a unique painting like this?</h3>
        <p>Reach out to commission a personalized artwork, whether it's of your beloved pet, favorite car, or something special to you.</p>
        <a href='mailto:contact@tmunz.art' target='_blank' rel='noopener noreferrer'>contact@tmunz.art</a>
        <div className='image-container'>
          <Taped>
            <br />
            <WebpImage src={require(`./dog.jpg?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} alt='dog painting' />
          </Taped>
        </div>
      </div>
    </PaintingCanvas>
  );
}
