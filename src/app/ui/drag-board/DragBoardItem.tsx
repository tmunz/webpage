import './DragBoardItem.styl';

import React, { createContext, ReactNode } from "react";
import { handleStart } from './DragBoardUserEvents';


export interface DragBoardItemConsuming extends DragBoardItemState {
  isDragging: boolean;
  onPointerDown: (id: string, e: { clientX: number, clientY: number, rect: DOMRect }) => void;
}

export interface DragBoardItemState {
  id: string;
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

export const DragBoardItem = (props: Partial<DragBoardItemCurrentState> & { children?: ReactNode, disableDrag?: boolean, className?: string }) => {
  return (
    <DragBoardItemContext.Consumer>
      {(value: DragBoardItemConsuming | null) => {
        if (!value) return null;
        const x = props?.x ?? value.current?.x ?? 0;
        const y = props?.y ?? value.current?.y ?? 0;
        const z = props?.z ?? value.current?.z ?? 0;
        const rotation = props?.rotation ?? value.current?.rotation ?? 0;

        return <div
          key={value.id}
          className={`${props.className ?? ''} drag-board-item ${value.isDragging ? 'drag-board-item-dragging' : ''} ${props.disableDrag ? 'drag-board-item-drag-disabled' : ''}`}
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