import React, { ReactNode } from "react";

import './Polaroid.styl';


export function Polaroid(props: { title?: string, backside?: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`polaroid ${props.className ? props.className : ''}`}>
    <div className='polaroid-frontside'>
      <div className='polaroid-image'>
        {props.children}
      </div>
      <div className='polaroid_caption'>
        <h3>{props.title}</h3>
      </div>
    </div>
    <div className='polaroid-backside'>
      {props.backside}
    </div>
  </div>;
}