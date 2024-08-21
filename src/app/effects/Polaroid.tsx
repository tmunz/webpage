import './Polaroid.styl';

import React, { useEffect, useState } from "react";


export function Polaroid(props: { caption?: string, flipOnHover?: boolean, flipped?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const [flipped, setFlipped] = useState(props.flipped);

  useEffect(() => {
    setFlipped(props.flipped ?? false);
  }, [props.flipped]);

  const flip = () => {
    setFlipped(f => !f);
  }

  if (props.children && (!Array.isArray(props.children) || 2 < props.children.length)) {
    throw new Error('Polaroid can only handle up to two children (frontside and backside)');
  }

  const childrenArray = Array.isArray(props.children) ? props.children : [props.children];
  const hasBackside = 2 <= childrenArray.length;

  return <div {...props} className={`polaroid ${props.className ? props.className : ''}
   ${props.flipOnHover ? 'flip-on-hover' : ''}
   ${flipped ? 'flipped' : ''}
   `}>
    <div className="polaroid-card">
      <div className='polaroid-frontside'>
        <div className='polaroid-image'>
          {1 <= childrenArray.length && childrenArray[0]}
        </div>
        <div className='polaroid-caption'>
          {props.caption}
        </div>
        {hasBackside && <button className='flip-button' onClick={flip} />}
      </div>
      <div className='polaroid-backside'>
        {hasBackside && childrenArray[1]}
        {hasBackside && <button className='flip-button' onClick={flip} />}
      </div>
    </div>
  </div >;
}