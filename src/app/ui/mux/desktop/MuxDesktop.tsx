import './MuxDesktop.css';
import React, { useEffect, useState } from "react";
import { MuxTaskbar } from "./taskbar/MuxTaskbar";
import { MuxProgram, MuxProgramState } from '../MuxProgram';
import { DefaultTheme } from '../themes/default/DefaultTheme';
import { useMuxOs } from '../MuxOs';
import { MuxProgramWindow } from './window/MuxProgramWindow';
import { DragBoard } from '../../drag-board/DragBoard';
import { DragBoardItem } from '../../drag-board/DragBoardItem';
import { useDimension } from '../../../utils/useDimension';
import { Resizable } from '../../Resizable';
import { usePointer } from '../../../utils/usePointer';

export const MuxDesktop = ({ programs }: { programs: Map<string, MuxProgram> }) => {

  const elementRef = React.useRef<HTMLDivElement>(null);
  const muxOs = useMuxOs();
  const [programStates, setProgramStates] = useState<Map<string, MuxProgramState>>(muxOs.programStates$.getValue());
  const dimensions = useDimension(elementRef);
  const pointer$ = usePointer(elementRef);

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
      <img className='mux-desktop-background' src={theme.wallpaper} />
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
      <MuxTaskbar
        programStates={programStates}
        programs={programs}
        onOpen={(programId) => muxOs.startProgram(programId)}
        pointer$={pointer$}
      />
    </div >
  );
}
