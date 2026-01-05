import './FlipCard.css';
import React, { useEffect, useState } from 'react';


export interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  flipOnHover?: boolean;
  flipped?: boolean;
}

export function FlipCard(props: FlipCardProps) {
  const [flipped, setFlipped] = useState(props.flipped);

  if (props.children && (!Array.isArray(props.children) || 2 < props.children.length)) {
    throw new Error('FlipCard can only handle up to two children (frontside and backside)');
  }

  useEffect(() => {
    setFlipped(props.flipped ?? false);
  }, [props.flipped]);

  const flip = () => {
    setFlipped(f => !f);
  };

  const childrenArray = React.Children.toArray(props.children);
  const hasBackside = childrenArray.length > 1;

  return (
    <div
      {...props}
      className={`flip-card ${props.className || ''} ${props.flipOnHover ? 'flip-on-hover' : ''} ${flipped ? 'flipped' : ''}`}
    >
      <div className='flip-card-inner'>
        <div className='flip-card-front'>
          {childrenArray[0]}
          {hasBackside && <button className='flip-button' onClick={flip} />}
        </div>
        {hasBackside && (
          <div className='flip-card-back'>
            {childrenArray[1]}
            <button className='flip-button' onClick={flip} />
          </div>
        )}
      </div>
    </div>
  );
}
