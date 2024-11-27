import './DragBoard.styl';
import React, { useRef } from 'react';
import { DragBoardItemContext } from './DragBoardItem';
import { handlePointerEvents } from './handlePointerEvents';
import { useDragBoardState } from './useDragBoardState';
import { useDragEvents } from './useDragEvents';
import { DragBoardIndicator } from './DragBoardIndicator';
import { useFlipThrough } from './useFlipThrough';
import { useDragSwipe } from './useDragSwipe';
import { DragSwipeIndicator } from './DragSwipeIndicator';


export interface DragBoardProps {
  children: React.ReactNode;
  className?: string;
  placementPattern?: { x: number, y: number, rotation: number }[];
  indicator?: boolean;
}

const SMOOTHNESS = 5;
const PLACEMENT_PATTERN = [{ x: 0, y: 0, rotation: 0 }];

const mapChildrenToIds = (children: React.ReactNode): string[] => {
  return React.Children.map(children, (child, i) => ((child as React.ReactElement).key ?? i).toString()) ?? [];
}

export const DragBoard = ({ children, className, placementPattern = PLACEMENT_PATTERN, indicator = false }: DragBoardProps) => {

  const boardRef = useRef<HTMLDivElement>(null);

  const { itemStates, updateItemState, selectedItem, setSelectedItem, updateSelectedItem, bringToBack, updateItemOrder, lastSelectedItemPosition } = useDragBoardState(children, placementPattern, SMOOTHNESS, mapChildrenToIds);
  const { handleDragging, handleDragEnd } = useDragEvents(boardRef, itemStates, updateItemState, selectedItem, updateSelectedItem);
  const { dragSwipeProgress, handleDragSwiping, handleDragSwipeEnd } = useDragSwipe(boardRef, selectedItem, bringToBack);
  useFlipThrough(boardRef, updateItemOrder);
  handlePointerEvents(
    selectedItem?.id ?? null,
    (e) => { handleDragging(e); handleDragSwiping(e); },
    () => { handleDragEnd(); handleDragSwipeEnd(); },
  );

  return (
    <div className={`drag-board ${className ? className : ''}`} ref={boardRef}>
      {React.Children.map(children, (child, i) => {
        const itemState = itemStates.get(((child as React.ReactElement).key ?? i).toString()) ?? null;
        if (!itemState) return null;

        return (
          <DragBoardItemContext.Provider value={{
            ...itemState,
            isDragging: (selectedItem?.id === itemState?.id && selectedItem?.isDragging) ?? false,
            onPointerDown: setSelectedItem,
          }}>
            {child}
          </DragBoardItemContext.Provider>
        );
      })}
      {dragSwipeProgress && <DragSwipeIndicator overflow={dragSwipeProgress} position={lastSelectedItemPosition} />}
      {indicator && <DragBoardIndicator
        sortedItems={mapChildrenToIds(children).map(id => ({ id, zIndex: itemStates.get(id)?.z ?? -1 }))}
        onSelect={(id, zIndex) => updateItemState(id, { z: zIndex })}
      />}
    </div>
  );
};
