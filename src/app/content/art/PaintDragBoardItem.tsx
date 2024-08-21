import './PaintDragBoardItem.styl';

import React, { useState } from 'react';
import { PaperFolding } from '../../effects/PaperFolding';
import { OilPaintingWithControls } from '../../ui/oil-painting/OilPaintingWithControls';
import { DragBoardItem } from '../../ui/drag-board/DragBoardItem';

const GAP = 20;

export function PaintDragBoardItem(props: { width: number, height: number }) {

  const [active, setActive] = useState(false);

  return <DragBoardItem disableDrag={active} x={active ? GAP : undefined} y={active ? GAP : undefined} rotation={active ? 0 : undefined}>
    <div className={`paint-drag-board-item ${active ? 'active' : ''}`}>
      <PaperFolding onUnfold={() => setActive(true)} onInfold={() => setActive(false)}>
        <OilPaintingWithControls width={props.width - 2 * GAP} height={props.height - 2 * GAP} />
      </PaperFolding>
    </div>
  </DragBoardItem >;
}