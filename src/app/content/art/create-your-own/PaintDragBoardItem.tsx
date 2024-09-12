import './PaintDragBoardItem.styl';
import React, { useState } from 'react';
import { PaperFolding } from '../../../effects/PaperFolding';
import { OilPaintingWithControls } from '../../../ui/oil-painting/OilPaintingWithControls';
import { DragBoardItem } from '../../../ui/drag-board/DragBoardItem';

export function PaintDragBoardItem({ width, height, gap = 40 }: { width: number, height: number, gap?: number }) {

  const [active, setActive] = useState(false);

  return <DragBoardItem
    disableDrag={active}
    x={active ? 0 : undefined}
    y={active ? 0 : undefined}
    rotation={active ? 0 : undefined}
    className='paint-drag-board-item'
  >
    <PaperFolding onUnfold={() => setActive(true)} onInfold={() => setActive(false)} title='Paint your own Masterpiece'>
      <OilPaintingWithControls width={width - 2 * gap} height={height - 2 * gap} />
    </PaperFolding>
  </DragBoardItem >;
}