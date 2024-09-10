import './DragBoardItem.styl';

import React, { createContext, ReactNode } from "react";
import { handleStart } from './DragBoardUserEvents';


export interface DragBoardItemConsuming extends DragBoardItemState {
  isDragging: boolean;
  onPointerDown: (id: number, e: { clientX: number, clientY: number, rect: DOMRect }) => void;
}

export interface DragBoardItemState {
  id: number;
  current: DragBoardItemCurrentState;
  target: { x?: number; y?: number; rotation?: number };
}

export interface DragBoardItemCurrentState {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

export const DragBoardItemContext = createContext<DragBoardItemConsuming | null>(null);

export const DragBoardItem = (props: Partial<DragBoardItemCurrentState> & { children?: ReactNode, disableDrag?: boolean }) => {
  return (
    <DragBoardItemContext.Consumer>
      {(value: DragBoardItemConsuming | null) => {
        if (!value) return null;
        const x = props?.x ?? value.current.x;
        const y = props?.y ?? value.current.y;
        const z = props?.z ?? value.current.z;
        const rotation = props?.rotation ?? value.current.rotation;

        return <div
          key={value.id}
          className={`drag-board-item ${value.isDragging ? 'drag-board-item-dragging' : ''} ${props.disableDrag ? 'drag-board-item-drag-disabled' : ''}`}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            zIndex: z + 1,
          }}
          onTouchStart={(e) => !props.disableDrag && value.onPointerDown(value.id, handleStart(e.touches[0], e))}
          onMouseDown={(e) => !props.disableDrag && value.onPointerDown(value.id, handleStart(e, e))}
        >
          {props.children}
        </div>
      }}
    </DragBoardItemContext.Consumer >
  );
};