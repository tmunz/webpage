import './MuxDesktop.styl';
import React, { useEffect, useState } from "react";
import { MuxTaskbar } from "./MuxTaskbar";
import { MuxMainWindow } from "./MuxMainWindow";
import { MuxProgram } from '../MuxProgram';
import { MuxMenu } from './MuxMenu';
import { MuxGui, MuxProgramState } from '../MuxGui';
import { DefaultTheme } from '../themes/default/DefaultTheme';

export const MuxDesktop = ({ programs }: { programs: Map<string, MuxProgram> }) => {

  const [programStates, setProgramStates] = useState<Map<string, MuxProgramState>>(MuxGui.get().programStates$.getValue());
  const theme = DefaultTheme;

  useEffect(() => {
    const subscriptions = [
      MuxGui.get().programStates$.subscribe(setProgramStates),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, []);

  const programState = [...programStates.values()].find(p => p.isRunning);
  const program = programState ? programs.get(programState.id) : null;

  return (
    <div className='mux-desktop'>
      <MuxMenu theme={theme} onOpen={(programId) => MuxGui.get().startProgram(programId)} programs={programs} />
      <MuxMainWindow onClose={(programId) => MuxGui.get().quitProgram(programId)} program={program} />
      <MuxTaskbar theme={theme} onOpen={(programId) => MuxGui.get().startProgram(programId)} programs={programs} />
    </div >
  );
}