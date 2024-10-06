import './MuxDesktop.styl';
import React, { useEffect, useState } from "react";
import { MuxTaskbar } from "./MuxTaskbar";
import { MuxProgram, MuxProgramState } from '../MuxProgram';
import { MuxMenu } from './MuxMenu';
import { DefaultTheme } from '../themes/default/DefaultTheme';
import { MuxOs } from '../MuxOs';
import { MuxProgramWindow } from './MuxProgramWindow';
import { DragBoard } from '../../drag-board/DragBoard';
import { DragBoardItem } from '../../drag-board/DragBoardItem';

export const MuxDesktop = ({ programs }: { programs: Map<string, MuxProgram> }) => {

  const muxOs = MuxOs.get();

  const [programStates, setProgramStates] = useState<Map<string, MuxProgramState>>(muxOs.programStates$.getValue());
 
  // TODO
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
      <MuxMenu />
      <DragBoard className='mux-main-window'>
        {[...programStates.values()].map(programState => (
          <DragBoardItem key={programState.program.id}>
            <MuxProgramWindow
              program={programState.program}
            />
          </DragBoardItem>
        ))}
      </DragBoard>
      <MuxTaskbar onOpen={(programId) => muxOs.startProgram(programId)} programs={programs} clock={muxOs.getProgramsBySlot('clock')[0]} />
    </div >
  );
}
