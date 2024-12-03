import './Mux.styl';
import { useEffect, useState } from 'react';
import { MuxDesktop } from './desktop/MuxDesktop';
import { MuxProgram } from './MuxProgram';
import { Log, MuxOs, useMuxOs } from './MuxOs';
import React from 'react';
import { MuxBootScreen } from './MuxBootScreen';
import { StandardClock } from './programs/standard-clock/StandardClock';
import { Terminal } from './programs/terminal/Terminal';
import { Draw } from './programs/draw/Draw';

export interface MuxProps {
  programs: MuxProgram[];
  onOff: () => void;
  bootTime?: number;
}

const DEFAULT_PROGRAMS: MuxProgram[] = [
  StandardClock,
  Terminal,
  Draw,
];


// this is a simulation of a modern retro computer operating system (whatever this means ;-)
export const Mux = ({ programs, onOff, bootTime = 2000 }: MuxProps) => {
  const muxOs = useMuxOs();
  const [bootId, setBootId] = useState<string | null>(muxOs.bootId$.getValue());
  const [bootProcess, setBootProcess] = useState<number>(muxOs.bootProcess$.getValue());
  const [stdout, setStdout] = useState<Log[]>(muxOs.stdout$.getValue());
  const [installedPrograms, setInstalledPrograms] = useState<Map<string, MuxProgram>>(muxOs.programs$.getValue());

  useEffect(() => {
    const subscriptions = [
      muxOs.bootId$.subscribe(setBootId),
      muxOs.bootProcess$.subscribe(setBootProcess),
      muxOs.stdout$.subscribe(setStdout),
      muxOs.programs$.subscribe(setInstalledPrograms),
    ];
    muxOs.boot([...DEFAULT_PROGRAMS, ...programs], bootTime, onOff);

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, []);

  const booting = bootProcess < 1;

  return (
    <div className='mux'>
      {bootId && booting && <MuxBootScreen id={bootId} stdout={stdout} />}
      {bootId && <div style={{ display: booting ? 'none' : 'block', width: '100%', height: '100%' }}>
        <MuxDesktop programs={installedPrograms} />
      </div>}
    </div>
  );
}