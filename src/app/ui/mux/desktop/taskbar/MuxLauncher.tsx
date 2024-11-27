import './MuxLauncher.styl';
import { MuxOs } from '../../MuxOs';
import { MuxProgram } from '../../MuxProgram';
import React from "react";
import { MuxProgramIcon } from '../MuxProgramIcon';

interface MuxLauncherProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  onCloseLauncher: () => void;
  className?: string;
}

export const MuxLauncher = ({ programs, onOpen, onCloseLauncher, className }: MuxLauncherProps) => {
  const clock = MuxOs.get().getProgramsBySlot('clock')[0]; // TODO

  return (
    <div className={`mux-launcher ${className ? className : ''}`} onClick={() => onCloseLauncher()}>
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
      <div className='system-container'>
        {clock && clock.component && clock.component(MuxOs.get())}
        <ul className='controls'>
          <li><button onClick={() => MuxOs.get().pause()}>pause</button></li>
          <li><button onClick={() => MuxOs.get().sleep()}>sleep</button></li>
          <li><button onClick={() => MuxOs.get().shutdown()}>shutdown</button></li>
        </ul>
      </div>
    </div>
  );
}