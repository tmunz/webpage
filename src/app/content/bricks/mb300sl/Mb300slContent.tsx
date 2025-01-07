import { IconButton } from '../../../ui/icon/IconButton';
import { IconName } from '../../../ui/icon/IconName';
import './Mb300slContent.styl';
import React, { ReactNode } from 'react';

export function Mb300slContent() {

  const StickyContainer = ({ children }: { children: ReactNode }) => {
    return (
      <div className='sticky-container'>
        <div className='sticky-content'>{children}</div>
      </div>
    );
  };

  return (
    <div className='mb-300sl-content bricks-content'>
      <StickyContainer>
        <h1>300SL</h1>
      </StickyContainer>
      <StickyContainer>
        <h2>Instructions</h2>
        <p>
          Probably one of the most beautiful cars in history is now available in Creator Expert Car scale (1/13): the Mercedes-Benz 300SL Coupé (1955) from 1955.
        </p>
        <p>
          Besides the openable hood and trunk, the model features the iconic gullwing doors of the original.
        </p>
        <IconButton name={IconName.REBRICKABLE} href="https://rebrickable.com/mocs/MOC-59792/tmunz/mercedes-benz-300sl-gullwing-coupe-1955-300-sl" iconColor='#ffffff'>
            More details and instructions
        </IconButton>
      </StickyContainer>
      <StickyContainer>
        <h2>An Automotive Icon</h2>
        <p>
          The Mercedes-Benz 300SL Coupé, celebrated as the "Sports Car of the Century," is more than just the fastest production car of its era.
          It represents a harmonious blend of engineering and artistry, turning heads wherever it goes.
        </p>
        <p>
          Its striking design, highlighted by the iconic gullwing doors, became a symbol of innovation and luxury.
          Revered by car enthusiasts and immortalized by artists like Andy Warhol, the 300SL continues to inspire with its timeless allure.
        </p>
      </StickyContainer>
      <StickyContainer>
        <h2>Details</h2>
        <ul>
          <li>Width: 13cm / 16 studs</li>
          <li>Length: 35cm / 44 studs</li>
          <li>Height: 10cm / 10 bricks</li>
          <li>1443 pieces</li>
        </ul>
      </StickyContainer>
      <StickyContainer>
        <h2>Features</h2>
        <ul>
          <li>Rubber belt-loaded doors</li>
          <li>Rubber belt-supported hood mechanism</li>
          <li>Functional trunk</li>
          <li>Detailed engine</li>
        </ul>
      </StickyContainer>
    </div>
  );
};