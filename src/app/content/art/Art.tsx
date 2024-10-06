import './Art.styl';
import React from 'react';
import { DragBoard } from '../../ui/drag-board/DragBoard';
import { PaintDragBoardItem } from './create-your-own/PaintDragBoardItem';
import { useDimension } from '../../utils/Dimension';
import { DragBoardItem } from '../../ui/drag-board/DragBoardItem';
import { CitroenDsLamp } from './citroen-ds-lamp/CitroenDsLamp';
import { Mb300slPainting } from './mb300sl/Mb300slPainting';


export function Art() {

  const elementRef = React.useRef<HTMLDivElement>(null);
  const dimension = useDimension(elementRef, 40);

  return <div className='art' ref={elementRef}>
    <DragBoard
      placementPattern={[{ x: -10, y: -20, rotation: -2 }, { x: 10, y: 25, rotation: 1 }, { x: 40, y: 30, rotation: -0.5 }]}
      indicator
    >
      <DragBoardItem><CitroenDsLamp width={(dimension?.width ?? 400) * 0.6} height={(dimension?.height ?? 400) * 0.6} /></DragBoardItem>
      <PaintDragBoardItem width={dimension?.width ?? 400} height={dimension?.height ?? 400} />
      <DragBoardItem><Mb300slPainting /></DragBoardItem>
    </DragBoard>
  </div>;
}