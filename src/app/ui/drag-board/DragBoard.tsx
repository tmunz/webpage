import './DragBoard.styl';
import React, { useRef } from 'react';
import { DragBoardItemContext } from './DragBoardItem';
import { useUserEvents } from './DragBoardUserEvents';
import { useDragBoardState } from './useDragBoardState';
import { useDragEvents } from './useDragEvents';
import { DragBoardIndicator } from './DragBoardIndicator';
import { useDragBoardItemSelect } from './useDragBoardItemSelect';

export interface DragBoardProps {
  children: React.ReactNode;
  className?: string;
  placementPattern?: { x: number, y: number, rotation: number }[];
  indicator?: boolean;
}

const SMOOTHNESS = 10;
const PLACEMENT_PATTERN = [{ x: 0, y: 0, rotation: 0 }];
const mapChildrenToIds = (children: React.ReactNode): string[] => {
  return React.Children.map(children, (child, i) => ((child as React.ReactElement).key ?? i).toString()) ?? [];
}

export const DragBoard = ({ children, className, placementPattern = PLACEMENT_PATTERN, indicator = false }: DragBoardProps) => {

  const boardRef = useRef<HTMLDivElement>(null);

  const { itemStates, setItemStates } = useDragBoardState(children, placementPattern, SMOOTHNESS, mapChildrenToIds);
  const { selectedItem, setSelectedItem, handleSelectItem, handleScroll } = useDragBoardItemSelect(setItemStates);
  const { handleDragging, handleDragEnd } = useDragEvents(setItemStates, selectedItem, setSelectedItem, boardRef);
  useUserEvents(boardRef, selectedItem?.id ?? null, handleDragging, handleDragEnd, handleScroll);

  return (
    <div className={`drag-board ${className ? className : ''}`} ref={boardRef}>
      {React.Children.map(children, (child, i) => {
        const itemState = itemStates.get(((child as React.ReactElement).key ?? i).toString()) ?? null;
        if (!itemState) return null;

        return (
          <DragBoardItemContext.Provider value={{
            ...itemState,
            isDragging: (selectedItem?.id === itemState?.id && selectedItem?.isDragging) ?? false,
            onPointerDown: handleSelectItem
          }}>
            {child}
          </DragBoardItemContext.Provider>
        );
      })}
      {indicator && <DragBoardIndicator
        sortedItems={mapChildrenToIds(children).map(id => ({ id, zIndex: itemStates.get(id)?.current.z ?? -1 }))}
        onSelect={(id, zIndex) => setItemStates(prevStates => {
          const states = new Map(prevStates);
          const selectedState = states.get(id);
          if (selectedState) {
            states.set(id, { ...selectedState, current: { ...selectedState.current, z: zIndex } });
          }
          return states;
        })}
      />}
    </div>
  );
};
