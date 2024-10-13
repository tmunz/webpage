import './MuxTaskbar.styl';
import React from 'react';
import { MuxProgram, MuxProgramState } from '../MuxProgram';
import { MuxOs } from '../MuxOs';

interface MuxTaskBarProps {
  programStates: Map<string, MuxProgramState>;
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  clock?: MuxProgram;
}

export const MuxTaskbar = ({ programStates, programs, clock, onOpen }: MuxTaskBarProps) => {

  const taskBarProgramsPinned: MuxProgramState[] = [...programs.values()]
    .filter(p => p.pinned)
    .map(p => {
      const programState = programStates.get(p.id);
      if (programState) {
        return programState;
      }
      return { program: p, isRunning: false };
    }).sort((a, b) => a.program.name.localeCompare(b.program.name));

  const taskBarProgramsRunning: MuxProgramState[] = [...programStates.values()]
    .filter(p => !p.program.pinned)
    .sort((a, b) => a.program.name.localeCompare(b.program.name));

  return (
    <div className='mux-taskbar'>
      <ul className='mux-taskbar-pinned-programs'>
        {[...taskBarProgramsPinned, ...taskBarProgramsRunning]
          .map(ps => (
            <li key={ps.program.id}>
              <button onClick={() => { onOpen(ps.program.id); }}>
                <img src={ps.program.iconPath} alt={ps.program.name} />
              </button>
              <div className={`program-indicator ${ps.isRunning ? 'program-indicator-active' : ''}`} />
            </li>
          ))}
      </ul>
      {clock && clock.component(MuxOs.get())}
    </div>
  );
};

