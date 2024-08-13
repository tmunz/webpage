import React from 'react';
import { Knowledge } from './Knowledge';
import { VitaContent } from './VitaContent';

import './Vita.styl';


export function Vita() {
  return <div className="vita">
    <VitaContent />
    {false && <Knowledge />}
  </div >;
}