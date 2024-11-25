import './MuxLauncher.styl';
import { MuxOs } from '../../MuxOs';
import { MuxProgram } from '../../MuxProgram';
import React from "react";
import { MuxProgramIcon } from '../MuxProgramIcon';

interface MuxLauncherProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  onCloseLauncher: () => void
}

export const MuxLauncher = ({ programs, onOpen, onCloseLauncher }: MuxLauncherProps) => {
  return (
    <div className='mux-launcher' onClick={() => onCloseLauncher()}>
      <ul className='programs'>
        {[...programs.values()]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(p => (
            <li key={p.id}>
              <button onClick={() => {
                onOpen(p.id);
              }}>
                <MuxProgramIcon path={p.iconPath} name={p.name} monoColor={p.iconMonoColor} />
                <span>{p.name}</span>
              </button>
            </li>
          ))}
      </ul>
      <hr />
      <ul className='controls'>
        <li><button onClick={() => MuxOs.get().pause()}>pause</button></li>
        <li><button onClick={() => MuxOs.get().sleep()}>sleep</button></li>
        <li><button onClick={() => MuxOs.get().shutdown()}>shutdown</button></li>
      </ul>
    </div>
  );
}