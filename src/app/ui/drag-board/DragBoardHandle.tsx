import React, { createContext, ReactNode } from 'react';
import { handleStart } from './handlePointerEvents';


const MAX = 9999999;
const R = MAX / -2;

export interface DragBoardHandleConsuming {
  isDragging: boolean;
  onPointerDown: (e: { clientX: number, clientY: number }) => void;
}

interface DragBoardHandleProps {
  children?: ReactNode;
  disableDrag?: boolean;
  className?: string;
  dragBoardItemRect?: DOMRect;
}

export const DragBoardHandleContext = createContext<DragBoardHandleConsuming | null>(null);

export const DragBoardHandle = (props: DragBoardHandleProps) => {
  return (
    <DragBoardHandleContext.Consumer>
      {(value: DragBoardHandleConsuming | null) => {
        if (!value) return null;
        return <><div
          className={`${props.className ?? ''} drag-board-handle ${value.isDragging ? 'drag-board-handle-dragging' : ''} ${props.disableDrag ? 'drag-board-handle-drag-disabled' : ''}`}
          style={{ boxSizing: 'border-box', cursor: props.disableDrag ? 'normal' : 'grab' }}
          onTouchStart={(e) => !props.disableDrag && value.onPointerDown(handleStart(e.touches[0]))}
          onMouseDown={(e) => !props.disableDrag && value.onPointerDown(handleStart(e))}
        >
          {props.children}
        </div >
          {value.isDragging && <div style={{ position: 'fixed', cursor: 'grabbing', zIndex: MAX, top: R, left: R, width: MAX, height: MAX }} />}
        </>
      }}
    </DragBoardHandleContext.Consumer >
  );
};