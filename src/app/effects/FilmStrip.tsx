import './FilmStrip.css';
import React, { ReactNode } from 'react';

export const FilmStrip = ({ children, label }: { children?: ReactNode, label?: string }) => {
  return <div className='film-strip'>
    {children}
    <div className='film-strip-label'>
      { label }
    </div>
  </div>
}