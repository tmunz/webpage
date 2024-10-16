import React from 'react';
import { RgbaFilter } from '../../../effects/RgbaFilter';

export const MuxProgramIcon = ({ path, name, monoColor = false }: { path: string, name: string, monoColor?: boolean }) => {

  // TODO use theme
  return <RgbaFilter r={monoColor ? 1 : 1} g={monoColor ? 0.45 : 1} b={monoColor ? 0.01 : 1}>
    <img src={path} alt={name} />
  </RgbaFilter>;
}