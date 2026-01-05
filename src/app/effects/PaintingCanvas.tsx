import './PaintingCanvas.css';
import React from 'react';
import { FlipCard, FlipCardProps } from './FlipCard';

interface PaintingCanvasProps {
  className?: string;
}

export function PaintingCanvas({ children, className, ...props }: PaintingCanvasProps & FlipCardProps) {

  const childrenArray = React.Children.toArray(children);

  return (
    <FlipCard {...props} className={`painting-canvas ${className ? className : ''}`}>
      <div className='painting-canvas-frontside'>
        {childrenArray[0]}
      </div>
      <div className='painting-canvas-backside'>
        {new Array(4).fill(null).map((_, i) => <div key={i} className='corner' />)}
        <div className='painting-canvas-backside-content'>
          {childrenArray[1]}
        </div>
      </div>
    </FlipCard >
  );
}
