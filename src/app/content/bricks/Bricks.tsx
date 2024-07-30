import React from 'react';
import { ProjectBrickstorm } from './ProjectBrickstorm';
import { Polaroid } from '../../ui/Polaroid';

import './Bricks.styl';


export function Bricks() {
  return <div className='bricks'>
    <section className='polaroids'>
      <Polaroid className='flower-polaroid'>
        <img src={require('./assets/flowers.jpg')} />
      </Polaroid>
      <Polaroid className='eiffel-polaroid'>
        <ProjectBrickstorm />
      </Polaroid>
    </section>
    <section className='aircraft'>Ultimate Air- & Spacecraft Collection</section>
    <section className='mb-300sl'>300 SL</section>
  </div >;
}