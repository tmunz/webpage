import React from 'react';
import { MuxProgram } from '../MuxProgram';

interface MuxProgramSelectionProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
}

export const MuxProgramSelection = ({ programs, onOpen }: MuxProgramSelectionProps) => {

  const sortedProgramStates = Array.from(programs.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className='mux-program-selectin'>
      <ul>
        {sortedProgramStates.map(p => <li key={p.id}><button onClick={() => {
          onOpen(p.id);
        }}>{p.name}</button></li>)}
      </ul>
    </div>
  );
};
