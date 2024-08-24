import './DragBoard.styl';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragBoardItemContext, DragBoardItemState } from './DragBoardItem';
import { useUserEvents } from './DragBoardUserEvents';

export interface DragBoardProps {
  children: React.ReactNode;
}

export const DragBoard = ({ children }: DragBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    isDragging: boolean;
  } | null>(null);

  const [itemStates, setItemStates] = useState<DragBoardItemState[]>(
    React.Children.map(children, (child, i) => ({
      id: i,
      current: { x: 0, y: 0, z: i, rotation: Math.random() * 10 - 5, width: 0, height: 0 },
      target: {},
    })) ?? []
  );

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      setItemStates((prevStates) => {
        return prevStates.map((itemState) => {
          const current = itemState.current;
          const target = itemState.target;

          return {
            ...itemState,
            current: {
              ...current,
              x: current.x + (target.x !== undefined ? (target.x - current.x) * 0.1 : 0),
              y: current.y + (target.y !== undefined ? (target.y - current.y) * 0.1 : 0),
              rotation:
                current.rotation + (target.rotation !== undefined ? (target.rotation - current.rotation) * 0.1 : 0),
            },
          };
        });
      });

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = useCallback((id: number, e: { clientX: number, clientY: number, rect: DOMRect }) => {

    setItemStates((prevStates) => {
      const maxZ = Math.max(...prevStates.map((item) => item.current.z));
      return prevStates.map((itemState) =>
        itemState.id === id
          ? {
            ...itemState,
            current: {
              ...itemState.current,
              z: maxZ + 1,
              width: e.rect.width,
              height: e.rect.height,
            },
          }
          : itemState
      );
    });

    const board = boardRef.current;
    if (board) {
      const boardRect = board.getBoundingClientRect();
      setSelectedItem({
        id,
        offsetX: e.clientX - (e.rect.left - boardRect.left),
        offsetY: e.clientY - (e.rect.top - boardRect.top),
        startX: e.clientX,
        startY: e.clientY,
        isDragging: false,
      });
    }
  }, []);

  const handlePointerMove = useCallback((e: { clientX: number, clientY: number }) => {
    if (!selectedItem) return;

    const deltaX = e.clientX - selectedItem.startX;
    const deltaY = e.clientY - selectedItem.startY;

    if (!selectedItem.isDragging && Math.abs(deltaX) + Math.abs(deltaY) > 10) {
      setSelectedItem((prev) => prev && { ...prev, isDragging: true });
    }

    setItemStates((prev) => {
      const board = boardRef.current;
      if (!board) return prev;

      return prev.map((itemState) => {
        if (itemState.id !== selectedItem.id) return itemState;

        const target = {
          x: e.clientX - selectedItem.offsetX,
          y: e.clientY - selectedItem.offsetY,
          rotation: itemState.current.rotation,
          width: itemState.current.width,
          height: itemState.current.height,
        };

        return {
          ...itemState,
          target,
        };
      });
    });
  }, [selectedItem]);

  const handlePointerEnd = useCallback(() => {

    if (!selectedItem) return;

    setItemStates((prevStates) => {
      const board = boardRef.current;
      const boardRect = board?.getBoundingClientRect();
      return board && boardRect
        ? prevStates.map((itemState) => {
          if (itemState.id !== selectedItem.id) {
            return itemState;
          }

          const current = itemState.current;

          const minX = 0;
          const minY = 0;
          const maxX = boardRect.width - current.width;
          const maxY = boardRect.height - current.height;

          let targetX = current.x;
          let targetY = current.y;
          let targetRotation = current.rotation;

          if (current.x < minX) {
            targetX = minX;
            targetRotation = bounceAngle(current.rotation);
          } else if (current.x > maxX) {
            targetX = maxX;
            targetRotation = bounceAngle(current.rotation);
          }

          if (current.y < minY) {
            targetY = minY;
            targetRotation = bounceAngle(current.rotation);
          } else if (current.y > maxY) {
            targetY = maxY;
            targetRotation = bounceAngle(current.rotation);
          }

          return {
            ...itemState,
            target: { x: targetX, y: targetY, rotation: targetRotation },
          };
        })
        : prevStates;
    });

    setSelectedItem(null);
  }, [selectedItem]);

  const bounceAngle = (angle: number) => {
    const referenceAngle = Math.round(angle / 90) * 90;
    const offAngle = angle - referenceAngle;
    return referenceAngle - offAngle;
  };

  const handleScroll = useCallback((delta: number) => {
    setItemStates((prevStates) => {
      const { minIndex, maxIndex } = prevStates.reduce((agg, itemState, i, arr) => {
        return {
          minIndex: itemState.current.z < arr[agg.minIndex].current.z ? i : agg.minIndex,
          maxIndex: itemState.current.z > arr[agg.maxIndex].current.z ? i : agg.maxIndex,
        };
      }, { minIndex: 0, maxIndex: 0 });

      const min = prevStates[minIndex].current.z;
      const next = prevStates.map((itemState) => ({ ...itemState, current: { ...itemState.current, z: (itemState.current.z - min + 1) } }));

      if (minIndex !== undefined && maxIndex !== undefined) {
        if (delta < 0) {
          next[minIndex].current.z = next[maxIndex].current.z + 1;
        } else if (0 < delta) {
          next[maxIndex].current.z = next[minIndex].current.z - 1;
        }
      }

      return next;
    });
  }, []);

  useUserEvents(boardRef, selectedItem?.id ?? null, handlePointerMove, handlePointerEnd, handleScroll);

  return (
    <div className='drag-board' ref={boardRef}>
      {React.Children.map(children, (child, index) => {
        const itemState = itemStates[index];
        return (
          <DragBoardItemContext.Provider value={{
            ...itemState,
            isDragging: selectedItem?.id == itemState.id && selectedItem.isDragging,
            onPointerDown: handlePointerDown
          }}>
            {child}
          </DragBoardItemContext.Provider>
        );
      })}
    </div>
  );
};
