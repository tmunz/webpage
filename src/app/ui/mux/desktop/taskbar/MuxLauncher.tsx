import './MuxLauncher.css';
import { useMuxOs } from '../../MuxOs';
import { MuxProgram } from '../../MuxProgram';
import React from 'react';
import { MuxProgramIcon } from '../MuxProgramIcon';

interface MuxLauncherProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  onCloseLauncher: () => void;
  className?: string;
}

const ClockComponentWrapper = ({ clockProgram }: { clockProgram?: MuxProgram }) => {
  const muxOs = useMuxOs();

  if (!clockProgram) {
    return null;
  }

  return <>{clockProgram.component(muxOs)}</>;
};

export const MuxLauncher = ({ programs, onOpen, onCloseLauncher, className }: MuxLauncherProps) => {
  const muxOs = useMuxOs();
  const [clockProgramId, setClockProgramId] = React.useState(muxOs.settings$.getValue().clockProgramId);

  const clockPrograms = [...programs.values()].filter(p => p.slots?.includes('clock'));
  const clockProgram = clockPrograms.find(p => p.id === clockProgramId);

  React.useEffect(() => {
    const subscription = muxOs.settings$.subscribe(settings => {
      setClockProgramId(settings.clockProgramId);
    });
    return () => subscription.unsubscribe();
  }, [muxOs.settings$]);

  const selectClock = (programId: string) => {
    muxOs.updateSettings({ clockProgramId: programId });
  };

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
        <div className='mux-clock-display'>
          <ClockComponentWrapper clockProgram={clockProgram} />
          <select
            className='clock-selector'
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => selectClock(e.target.value)}
            value={clockProgram?.id || ''}
          >
            {clockPrograms.map(program => (
              <option
                key={program.id}
                value={program.id}
              >
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <ul className='controls'>
          <li><button onClick={() => muxOs.pause()}>pause</button></li>
          <li><button onClick={() => muxOs.sleep()}>sleep</button></li>
          <li><button onClick={() => muxOs.shutdown()}>shutdown</button></li>
        </ul>
      </div>
    </div>
  );
}