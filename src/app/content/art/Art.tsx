import './Art.styl';
import React, { Suspense, useRef } from 'react';
import { DragBoard } from '../../ui/drag-board/DragBoard';
import { DrawBoardItem } from './draw/DrawBoardItem';
import { useDimension } from '../../utils/useDimension';
import { DragBoardItem } from '../../ui/drag-board/DragBoardItem';
import { CitroenDsLamp } from './citroen-ds-lamp/CitroenDsLamp';
import { Mb300slPainting } from './mb300sl/Mb300slPainting';
import { DragBoardHandle } from '../../ui/drag-board/DragBoardHandle';
import { RoomDivider } from './room-divider/RoomDivider';
import { ChristmasTree } from './christmas-tree/ChristmasTree';
import { DelaySuspense } from '../../utils/DelaySuspense';


export function Art() {

  const elementRef = useRef<HTMLDivElement>(null);
  const dimension = useDimension(elementRef, 40);

  return <div className='art' ref={elementRef}>
    <DelaySuspense fallback={<div>Loading...</div>} renderDelay={500}>
      <DragBoard
        placementPattern={[{ x: -10, y: 0, rotation: 0.5 }, { x: 50, y: 5, rotation: -1.5 }, { x: -60, y: 10, rotation: -2 }]}
        indicator
      >
        <DrawBoardItem key={'draw'} width={dimension?.width ?? 600} height={dimension?.height ?? 400} />
        {[RoomDivider, ChristmasTree, CitroenDsLamp].map((Component, i) => (
          <DragBoardItem key={i}>
            <DragBoardHandle>
              <Component width={(dimension?.width ?? 600) * 0.6} height={(dimension?.height ?? 400) * 0.6} />
            </DragBoardHandle>
          </DragBoardItem>
        ))}
        <DragBoardItem key={'300sl'}><DragBoardHandle><Mb300slPainting width={Math.max(420, (dimension?.width ?? 420) * 0.4)} /></DragBoardHandle></DragBoardItem>
      </DragBoard>
    </DelaySuspense>
  </div>;
}