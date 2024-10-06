import './MuxTaskbar.styl';
import React from 'react';
import { MuxProgram } from '../MuxProgram';
import { MuxOs } from '../MuxOs';

interface MuxTaskBarProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  clock?: MuxProgram
}

export const MuxTaskbar = ({ programs, clock, onOpen }: MuxTaskBarProps) => {

  const sortedProgramStates = [...programs.values()].sort((a, b) => a.name.localeCompare(b.name));

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
      {clock && clock.component(MuxOs.get())}
    </div>
  );
};
