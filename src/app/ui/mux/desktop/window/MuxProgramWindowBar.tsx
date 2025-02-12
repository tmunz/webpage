import './MuxProgramWindowBar.styl';
import { MuxOs } from '../../MuxOs';
import { MuxProgram } from '../../MuxProgram';
import React, { useState } from 'react';
import { MuxProgramIcon } from '../MuxProgramIcon';
import { DragBoardHandle } from '../../../drag-board/DragBoardHandle';

const ABOUT = 'ⓘ';
const CLOSE = '✕';

interface MuxProgramWindowBarProps {
  program: MuxProgram
}

export const MuxProgramWindowBar = ({ program }: MuxProgramWindowBarProps) => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <>
      <DragBoardHandle className='mux-program-window-bar'>
        <div className='window-title'>
          <MuxProgramIcon path={program.iconPath} name={program.name} monoColor={program.iconMonoColor} />
          {program.name}
        </div>
        <button className='info-button' onClick={toggleInfo}>
          {ABOUT}
        </button>
        <button className='close-button' onClick={() => MuxOs.get().quitProgram(program.id)}>
          {CLOSE}
        </button>
        {showInfo && <div className='window-about'>{program.about}</div>}
      </DragBoardHandle>
    </>
  );
};
