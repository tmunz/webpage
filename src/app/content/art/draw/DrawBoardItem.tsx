import './DrawBoardItem.styl';
import React, { useState } from 'react';
import { PaperFolding } from '../../../effects/PaperFolding';
import { DrawWithControls } from '../../../ui/draw/DrawWithControls';
import { DragBoardItem } from '../../../ui/drag-board/DragBoardItem';
import { DragBoardHandle } from '../../../ui/drag-board/DragBoardHandle';

export function DrawBoardItem({ width, height, gap = 40 }: { width: number, height: number, gap?: number }) {

  const [active, setActive] = useState(false);

  return <DragBoardItem
    x={active ? 0 : undefined}
    y={active ? 0 : undefined}
    rotation={active ? 0 : undefined}
    className='draw-board-item'
  >
    <DragBoardHandle disableDrag={active}>
      <PaperFolding onUnfold={() => setActive(true)} onInfold={() => setActive(false)} title='Paint your own Masterpiece'>
        <DrawWithControls width={width - 2 * gap} height={height - 2 * gap} />
      </PaperFolding>
    </DragBoardHandle>
  </DragBoardItem >;
}