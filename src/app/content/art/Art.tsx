import './Art.css';
import React from 'react';
import { DelaySuspense } from '../../utils/DelaySuspense';
import { ArtBoard } from './ArtBoard';

export function Art() {
  return <div className='art'>
    <DelaySuspense fallback={<div>Loading...</div>} renderDelay={800} fadeIn={1200}>
      <ArtBoard />
    </DelaySuspense>
  </div>;
}
