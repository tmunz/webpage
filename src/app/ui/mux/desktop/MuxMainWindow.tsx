import React from 'react';
import { MuxProgramWindow } from './MuxProgramWindow';
import { MuxProgram } from '../MuxProgram';

interface MuxMainWindowProps {
  program?: MuxProgram | null;
  onClose: (programId: string) => void;
}

export const MuxMainWindow = ({ program, onClose }: MuxMainWindowProps) => {

  return (
    <div className='mux-main-window'>
      {program && <MuxProgramWindow program={program} onClose={() => onClose(program.id)} />}
    </div>
  );
};
