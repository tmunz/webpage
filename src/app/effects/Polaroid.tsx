import './Polaroid.css';
import React from 'react';
import { FlipCard, FlipCardProps } from './FlipCard';

interface PolaroidProps {
  className?: string;
  caption?: string;
}


export function Polaroid({ caption, children, className, ...props }: PolaroidProps & FlipCardProps) {

  const childrenArray = React.Children.toArray(children);

  return (
    <FlipCard {...props} className={`polaroid ${className ? className : ''}`}>
      <div className='polaroid-frontside'>
        <div className='polaroid-image'>
          {childrenArray[0]}
        </div>
        <div className='polaroid-caption'>
          {caption}
        </div>
      </div>
      <div className='polaroid-backside'>
        <div className='polaroid-image' />
        <div className='polaroid-backside-content'>
          {childrenArray[1]}
        </div>
      </div>
    </FlipCard >
  );
}
