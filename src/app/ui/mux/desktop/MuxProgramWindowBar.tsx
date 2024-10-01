import './MuxProgramWindowBar.styl';
import React, { useState, ReactNode } from 'react';

const ABOUT = '🛈';
const CLOSE = '✕';

export const MuxProgramWindowBar = ({ title, about, onClose }: { title: string, about: ReactNode, onClose: () => void }) => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <div className='mux-program-window-bar'>
      <div className='window-title'>{title}</div>
      <button className='info-button' onClick={toggleInfo}>
        {ABOUT}
      </button>
      <button className='close-button' onClick={onClose}>
        {CLOSE}
      </button>
      {showInfo && <div className='window-about'>{about}</div>}
    </div>
  );
};
