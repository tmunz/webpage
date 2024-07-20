import React from 'react';
import { ProjectBrickstorm } from './ProjectBrickstorm';

import './Lego.styl';


export function Lego() {
  return <div className='lego'>
    <ul>
      <li>Flowers</li>
      <li>300 SL</li>
      <li>Ultimate Air- & Spacecraft Collection</li>
      <li>Project Brickstorm
        <ProjectBrickstorm />
      </li>
    </ul>
    <p>coming soon</p>
  </div>;
}