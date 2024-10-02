import './MuxTaskbar.styl';
import React from 'react';
import { MuxTheme } from '../MuxTheme';
import { MuxProgram } from '../MuxProgram';
import { MuxOs } from '../MuxOs';

interface MuxTaskBarProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  theme: MuxTheme;
}

export const MuxTaskbar = ({ programs, theme, onOpen }: MuxTaskBarProps) => {

  const sortedProgramStates = Array.from(programs.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className='mux-taskbar'>
      <ul className='mux-taskbar-pinned-programs'>
        {sortedProgramStates
          /* TODO .filter(p => p.pinned)*/
          .map(p => <li key={p.id}>
            <button onClick={() => { onOpen(p.id); }}>
              <img src={p.iconPath} />
            </button>
          </li>)}
      </ul>
      {MuxOs.get().getProgramsBySlot('clock')[0]?.component(MuxOs.get())}
    </div>
  );
};
