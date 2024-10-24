import './DragBoardItem.styl';

import React, { createContext, ReactNode } from "react";
import { handleStart } from './DragBoardUserEvents';


export interface DragBoardItemConsuming extends DragBoardItemState {
  isDragging: boolean;
  onPointerDown: (id: string, e: { clientX: number, clientY: number, rect: DOMRect }) => void;
}

export interface DragBoardItemState {
  id: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
}

interface DragBoardItemProps extends Partial<DragBoardItemState> {
  children?: ReactNode;
  disableDrag?: boolean;
  className?: string;
}

export const DragBoardItemContext = createContext<DragBoardItemConsuming | null>(null);

export const DragBoardItem = (props: DragBoardItemProps) => {
  return (
    <DragBoardItemContext.Consumer>
      {(value: DragBoardItemConsuming | null) => {
        if (!value) return null;
        const x = props?.x ?? value.x;
        const y = props?.y ?? value.y;
        const z = props?.z ?? value.z;
        const rotation = props?.rotation ?? value.rotation;

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