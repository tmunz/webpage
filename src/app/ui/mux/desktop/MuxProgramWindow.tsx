import './MuxProgramWindow.styl';
import React from 'react';
import { MuxProgram } from '../MuxProgram';
import { MuxOs } from '../MuxOs';
import { MuxProgramWindowBar } from './MuxProgramWindowBar';

export const MuxProgramWindow = ({ program }: { program: MuxProgram }) => {

  const muxOs = MuxOs.get();

  return (
    <div className='mux-program-window'>
      <MuxProgramWindowBar
        title={program.name}
        about={program.about}
        onClose={() => muxOs.quitProgram(program.id)}
      />
      <div className='mux-program-window-content'>
        {program.component(muxOs)}
      </div>
    </div>
  );
};
