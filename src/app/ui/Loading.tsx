import './Loading.styl';
import React, { Suspense } from 'react';

export function Loading({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className='loading'>
      <div className='ripple'></div>
    </div>}>
      {children}
    </Suspense>
  );
}