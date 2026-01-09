import './MuxProgramWindow.css';
import React, { useEffect, useState } from 'react';
import { MuxProgram } from '../../MuxProgram';
import { useMuxOs } from '../../MuxOs';
import { MuxProgramWindowBar } from './MuxProgramWindowBar';

const ProgramComponentWrapper = ({ program }: { program: MuxProgram }) => {
  const muxOs = useMuxOs();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (program.settings?.subscribe) {
      const unsubscribe = program.settings.subscribe(() => {
        forceUpdate({});
      });
      return unsubscribe;
    }
  }, [program.settings]);

  return <>{program.component(muxOs)}</>;
};

export const MuxProgramWindow = ({ program }: { program: MuxProgram }) => {
  return (
    <div className='mux-program-window'>
      <MuxProgramWindowBar program={program} />
      <div className='mux-program-window-content'>
        <ProgramComponentWrapper program={program} />
      </div>
    </div>
  );
};
