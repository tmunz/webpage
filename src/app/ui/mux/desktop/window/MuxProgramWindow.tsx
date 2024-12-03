import './MuxProgramWindow.styl';
import React from 'react';
import { MuxProgram } from '../../MuxProgram';
import { useMuxOs } from '../../MuxOs';
import { MuxProgramWindowBar } from './MuxProgramWindowBar';

export const MuxProgramWindow = ({ program }: { program: MuxProgram }) => {

  const muxOs = useMuxOs();

  return (
    <div className='mux-program-window'>
      <MuxProgramWindowBar program={program} />
      <div className='mux-program-window-content'>
        {program.component(muxOs)}
      </div>
    </div>
  );
};
