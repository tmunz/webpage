import './DragBoardItem.styl';
import { DragBoardHandleContext } from './DragBoardHandle';
import React, { createContext, ReactNode } from 'react';


export interface DragBoardItemConsuming extends DragBoardItemState {
  isDragging: boolean;
  onPointerDown: (id: string, dragBoardItemRect: DOMRect | null, e: { clientX: number, clientY: number }) => void;
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
  const elementRef = React.useRef<HTMLDivElement>(null);
  
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
          ref={elementRef}
          className={`${props.className ?? ''} drag-board-item`}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            zIndex: z + 1,
          }}
        >
          <DragBoardHandleContext.Provider value={{
            isDragging: value.isDragging,
            onPointerDown: (e: {
              clientX: number;
              clientY: number;
            }) => value.onPointerDown(value.id, elementRef.current?.getBoundingClientRect() ?? null, e),
          }}>
            {props.children}
          </DragBoardHandleContext.Provider>
        </div>
      }}
    </DragBoardItemContext.Consumer >
  );
};