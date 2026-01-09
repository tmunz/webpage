import './MuxProgramWindowBar.css';
import { MuxOs } from '../../MuxOs';
import { MuxProgram } from '../../MuxProgram';
import React, { useState } from 'react';
import { MuxProgramIcon } from '../MuxProgramIcon';
import { DragBoardHandle } from '../../../drag-board/DragBoardHandle';
import { MuxProgramSettings } from '../../MuxProgramSettings';

const ABOUT = 'ⓘ';
const SETTINGS = '⚙';
const CLOSE = '✕';

interface MuxProgramWindowBarProps {
  program: MuxProgram
}

export const MuxProgramWindowBar = ({ program }: MuxProgramWindowBarProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const muxOs = MuxOs.get();

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    setShowSettings(false);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowInfo(false);
  };

  return (
    <>
      <DragBoardHandle className='mux-program-window-bar'>
        <div className='window-title'>
          <MuxProgramIcon path={program.iconPath} name={program.name} monoColor={program.iconMonoColor} />
          {program.name}
        </div>
        {program.settings && (
          <button className='settings-button' onClick={toggleSettings}>
            {SETTINGS}
          </button>
        )}
        <button className='info-button' onClick={toggleInfo}>
          {ABOUT}
        </button>
        <button className='close-button' onClick={() => muxOs.quitProgram(program.id)}>
          {CLOSE}
        </button>
        {showInfo && <div className='window-about'>{program.about}</div>}
        {showSettings && program.settings && (
          <div className='window-settings'>
            <MuxProgramSettings config={program.settings} />
          </div>
        )}
      </DragBoardHandle>
    </>
  );
};
