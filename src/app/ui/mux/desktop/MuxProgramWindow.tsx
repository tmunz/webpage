import './MuxProgramWindow.styl';
import React from 'react';
import { MuxProgram } from '../MuxProgram';
import { MuxOs } from '../MuxOs';
import { MuxProgramWindowBar } from './MuxProgramWindowBar';
import { MuxGui } from '../MuxGui';

export const MuxProgramWindow = ({ program, onClose }: { program: MuxProgram, onClose: () => void }) => {
  return (
    <div className='mux-program-window'>
      <MuxProgramWindowBar title={program.name} about={program.about} onClose={onClose} />
      {program.component(MuxOs.get(), MuxGui.get())}
    </div >
  );
};
