import './MuxProgramWindow.styl';
import React from 'react';
import { MuxProgram } from '../MuxProgram';
import { muxOs } from '../MuxOs';
import { MuxProgramWindowBar } from './MuxProgramWindowBar';

export const MuxProgramWindow = ({ program, onClose }: { program: MuxProgram, onClose: () => void }) => {
  return (
    <div className='mux-program-window'>
      <MuxProgramWindowBar title={program.name} onClose={onClose} />
      {program.component(muxOs)}
    </div >
  );
};
