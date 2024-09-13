import { Polaroid } from '../../../effects/Polaroid';
import { Taped } from '../../../effects/Taped';
import './Mb300slPainting.styl';
import React from 'react';
export function Mb300slPainting() {


  return (
    <Polaroid className='mb-300sl-painting' caption='300SL'>
      <img {...require(`./300sl.jpg?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} draggable={false} alt='300sl painting' />
      <div className='text-container'>
        <h3>Would you like to own a unique painting like this?</h3>
        <p>Reach out to commission a personalized artwork, whether it's of your beloved pet, favorite car, or something special to you.</p>
        <a href='mailto:contact@tmunz.art' target='_blank' rel='noopener noreferrer'>contact@tmunz.art</a>
        <div className='image-container'>
          <Taped>
            <img {...require(`./dog.jpg?{sizes:[200, 400, 720, 1200, 2000], format: 'webp'}`)} draggable={false} alt='dog painting' />
          </Taped>
        </div>
      </div>
    </Polaroid>
  );
}