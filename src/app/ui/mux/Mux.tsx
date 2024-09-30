import './Mux.styl';
import { useEffect, useState } from "react";
import { MuxDesktop } from "./desktop/MuxDesktop";
import { MuxProgram } from "./MuxProgram";
import { Log, muxOs } from "./MuxOs";
import React from "react";
import { MuxBootScreen } from "./MuxBootScreen";
import { StandardClock } from "./programs/StandardClock/StandardClock";
import { DefaultTheme } from "./themes/default/DefaultTheme";

export interface MuxProps {
  programs: MuxProgram[];
  onShutdown: () => void;
  bootTime?: number;
}

const DEFAULT_PROGRAMS: MuxProgram[] = [
  StandardClock,
];


// this is a simulation of a modern retro computer operating system (whatever this means ;-)
export const Mux = ({ programs, onShutdown, bootTime = 2000 }: MuxProps) => {

  const [bootId, setBootId] = useState<string>(muxOs.bootId$.getValue());
  const [bootProcess, setBootProcess] = useState<number>(muxOs.bootProcess$.getValue());
  const [stdout, setStdout] = useState<Log[]>(muxOs.stdout$.getValue());
  const [registeredPrograms, setRegisteredPrograms] = useState<Map<string, MuxProgram>>(muxOs.programs$.getValue());

  useEffect(() => {
    const subscriptions = [
      muxOs.bootId$.subscribe(setBootId),
      muxOs.bootProcess$.subscribe(setBootProcess),
      muxOs.stdout$.subscribe(setStdout),
      muxOs.programs$.subscribe(setRegisteredPrograms),
    ];
    muxOs.boot([...DEFAULT_PROGRAMS, ...programs], bootTime, onShutdown);

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, []);

  const booting = bootProcess < 1;

  return (
    <div className='mux'>
      {booting ?
        <MuxBootScreen id={bootId} stdout={stdout} /> :
        <MuxDesktop programs={registeredPrograms} theme={DefaultTheme} />}
    </div>
  );
}