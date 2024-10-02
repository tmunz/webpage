import './MuxDesktop.styl';
import React, { useEffect, useState } from "react";
import { MuxTaskbar } from "./MuxTaskbar";
import { MuxProgram, MuxProgramState } from '../MuxProgram';
import { MuxMenu } from './MuxMenu';
import { DefaultTheme } from '../themes/default/DefaultTheme';
import { MuxOs } from '../MuxOs';
import { MuxProgramWindow } from './MuxProgramWindow';

export const MuxDesktop = ({ programs }: { programs: Map<string, MuxProgram> }) => {

  const muxOs = MuxOs.get();

  const [programStates, setProgramStates] = useState<Map<string, MuxProgramState>>(muxOs.programStates$.getValue());
  const theme = DefaultTheme;

  useEffect(() => {
    const subscriptions = [
      muxOs.programStates$.subscribe(setProgramStates),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, []);

  return (
    <div className='mux-desktop'>
      <MuxMenu theme={theme} onOpen={(programId) => muxOs.startProgram(programId)} programs={programs} />
      <div className='mux-main-window'>
        {[...programStates.values()].map(programState => <MuxProgramWindow
          key={programState.program.id}
          program={programState.program}
          rect={programState.window}
        />)}
      </div>
      <MuxTaskbar theme={theme} onOpen={(programId) => muxOs.startProgram(programId)} programs={programs} />
    </div >
  );
}