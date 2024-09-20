import './MuxTaskbar.styl';
import React from 'react';
import { muxOs } from '../MuxOs';
import { MuxTheme } from '../MuxTheme';

export const MuxTaskbar = ({ theme }: { theme: MuxTheme }) => {
  return (
    <div className='mux-taskbar' style={{ background: theme.barColor }}>
      <div />
      {muxOs.getProgramsBySlot('clock')[0]?.component(muxOs)}
    </div>
  );
};
