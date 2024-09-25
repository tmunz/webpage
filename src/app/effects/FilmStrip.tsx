import './FilmStrip.styl';
import React, { ReactNode } from 'react';

export const FilmStrip = ({ children }: { children?: ReactNode }) => {
  return <div className='film-strip'>
    {children}
  </div>
}