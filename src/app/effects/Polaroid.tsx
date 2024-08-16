import './Polaroid.styl';

import React, { ReactNode } from "react";


export function Polaroid(props: { caption?: string, backside?: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  if (props.children && (!Array.isArray(props.children) || 2 < props.children.length)) {
    throw new Error('Polaroid can only handle up to two children (frontside and backside)');
  }

  const childrenArray = Array.isArray(props.children) ? props.children : [props.children];

  return <div {...props} className={`polaroid ${props.className ? props.className : ''}`}>
    <div className="polaroid-card">
      <div className='polaroid-frontside'>
        <div className='polaroid-image'>
          {1 <= childrenArray.length && childrenArray[0]}
        </div>
        <div className='polaroid-caption'>
          {props.caption}
        </div>
      </div>
      <div className='polaroid-backside'>
        {2 <= childrenArray.length && childrenArray[1]}
      </div>
    </div>
  </div >;
}