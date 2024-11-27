import './MuxTaskbar.styl';
import React, { useState } from 'react';
import { MuxProgram, MuxProgramState } from '../../MuxProgram';
import { MuxDockItem } from './MuxDockItem';
import { BehaviorSubject } from 'rxjs';
import { Pointer } from '../../../../utils/usePointer';
import { MuxProgramIcon } from '../MuxProgramIcon';
import { MuxLauncher } from './MuxLauncher';

interface MuxTaskBarProps {
  programStates: Map<string, MuxProgramState>;
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  pointer$: BehaviorSubject<Pointer>;
}

export const MuxTaskbar = ({ programStates, programs, onOpen, pointer$ }: MuxTaskBarProps) => {

  const [launcherOpen, setLauncherOpen] = useState(false);

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
    <>
      <ul className={`mux-taskbar ${launcherOpen ? 'mux-taskbar-hidden' : ''}`}>
        <MuxDockItem id='launcher' pointer$={pointer$} onOpen={() => setLauncherOpen(s => !s)}>
          <MuxProgramIcon path={require('./launcher.png')} name='launcher' />
        </MuxDockItem>
        <MuxDockItem id='divider' pointer$={pointer$} width={1} />
        {[...taskBarProgramsPinned, ...taskBarProgramsRunning]
          .map(ps => <MuxDockItem id={ps.program.id} pointer$={pointer$} onOpen={() => onOpen(ps.program.id)}>
            <MuxProgramIcon path={ps.program.iconPath} name={ps.program.name} monoColor={ps.program.iconMonoColor ?? false} />
            <div className={`program-indicator ${ps.isRunning ? 'program-indicator-active' : ''}`} />
          </MuxDockItem>)}
      </ul>
      <MuxLauncher className={`${!launcherOpen ? 'mux-launcher-hidden' : ''}`} programs={programs} onOpen={onOpen} onCloseLauncher={() => setLauncherOpen(false)} />
    </>
  );
};

