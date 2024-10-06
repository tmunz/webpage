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
import { useDimension } from '../../../utils/useDimension';
import { Resizable } from '../../Resizable';

export const MuxDesktop = ({ programs }: { programs: Map<string, MuxProgram> }) => {

  const elementRef = React.useRef<HTMLDivElement>(null);
  const muxOs = MuxOs.get();
  const [programStates, setProgramStates] = useState<Map<string, MuxProgramState>>(muxOs.programStates$.getValue());
  const dimensions = useDimension(elementRef);

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
    <div className='mux-desktop' ref={elementRef}>
      <MuxMenu />
      <DragBoard className='mux-main-window'>
        {[...programStates.values()].map(programState => (
          <DragBoardItem key={programState.program.id}>
            <Resizable
              width={(dimensions?.width ?? 600) * 0.8}
              height={(dimensions?.height ?? 400) * 0.8}
            >
              <MuxProgramWindow program={programState.program} />
            </Resizable>
          </DragBoardItem>
        ))}
      </DragBoard>
      <MuxTaskbar onOpen={(programId) => muxOs.startProgram(programId)} programs={programs} clock={muxOs.getProgramsBySlot('clock')[0]} />
    </div >
  );
}
