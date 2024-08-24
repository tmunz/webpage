import './Polaroid.styl';
import React from 'react';
import { FlipCard, FlipCardProps } from './FlipCard';

interface PolaroidProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  caption?: string;
}


export function Polaroid({ caption, children, className }: PolaroidProps & FlipCardProps) {

  const childrenArray = React.Children.toArray(children);

  return (
    <FlipCard className={`polaroid ${className ? className : ''}`}>
      <div className='polaroid-frontside'>
        <div className='polaroid-image'>
          {1 <= childrenArray.length && childrenArray[0]}
        </div>
        <div className='polaroid-caption'>
          {caption}
        </div>
      </div>
      <div className='polaroid-backside'>
        {childrenArray[1]}
      </div>
    </FlipCard>
  );
}
