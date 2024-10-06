import React from 'react';
import './Taped.styl';

export const CORNER = 0;
export const EDGE = 4;

export interface TapedProps extends React.HTMLAttributes<HTMLDivElement> {
  tapes?: number;
  children: React.ReactNode;
  type?: number;
}

export function Taped({ tapes = 2, type = CORNER, children, ...props }: TapedProps) {
  
  const tapePositions = Array.from({ length: tapes }, (_, i) => {
    const k = (i + type) % 8;
    return <div key={i} className={`tape tape-${k}`} />;
  });

  return (
    <div {...props} className={`taped ${props.className || ''}`}>
      {tapePositions}
      {children}
    </div>
  );
}
