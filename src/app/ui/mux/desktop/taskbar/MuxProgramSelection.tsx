import './MuxProgramSelection.css';
import React from 'react';
import { MuxProgram } from '../MuxProgram';

interface MuxProgramSelectionProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
}

export const MuxProgramSelection = ({ programs, onOpen }: MuxProgramSelectionProps) => {

  const sortedProgramStates = Array.from(programs.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className='mux-program-selection'>
      <ul>
        {sortedProgramStates.filter(p => p.pinned).map(p => <li key={p.id}>
          <button onClick={() => { onOpen(p.id); }}>
            <img src={p.iconPath} />
            <span>{p.name}</span>
          </button>
        </li>)}
      </ul>
    </div>
  );
};
