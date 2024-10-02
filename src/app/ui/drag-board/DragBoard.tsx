import './DragBoard.styl';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragBoardItemContext, DragBoardItemState } from './DragBoardItem';
import { useUserEvents } from './DragBoardUserEvents';
import { CarouselIndicator } from '../CarouselIndicator';

export interface DragBoardProps {
  children: React.ReactNode;
  placementPattern?: { x: number, y: number, rotation: number }[]
}

// positions are relative to the center of the board with axle directions to the right and down
export const DragBoard = ({ children, placementPattern = [{ x: 0, y: 0, rotation: 0 }] }: DragBoardProps) => {
  const SMOOTHNESS = 10;

  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
    isDragging: boolean;
  } | null>(null);

  const [itemStates, setItemStates] = useState<DragBoardItemState[]>(
    React.Children.map(children, (child, i) => {
      const placement = placementPattern[i % placementPattern.length];
      return {
        id: i,
        current: {
          ...placement, z: i
        },
        target: {},
      }
    }) ?? []
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
              x: current.x + (target.x !== undefined ? (target.x - current.x) / SMOOTHNESS : 0),
              y: current.y + (target.y !== undefined ? (target.y - current.y) / SMOOTHNESS : 0),
              rotation:
                current.rotation + (target.rotation !== undefined ? (target.rotation - current.rotation) / SMOOTHNESS : 0),
            },
          };
        });
      });
      animationFrameId = requestAnimationFrame(updatePosition);
    }

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = useCallback((id: number, e: { clientX: number, clientY: number, rect: DOMRect }) => {

    setItemStates((prevStates) => {
      const maxZ = Math.max(...prevStates.map((item) => item.current.z));
      return prevStates.map((itemState) => {
        if (itemState.id !== id) return itemState;
        setSelectedItem({
          id,
          offsetX: e.clientX - itemState.current.x,
          offsetY: e.clientY - itemState.current.y,
          width: e.rect.width,
          height: e.rect.height,
          startX: e.clientX,
          startY: e.clientY,
          isDragging: false,
        });
        return {
          ...itemState,
          current: {
            ...itemState.current,
            z: maxZ + 1,
          },
        };
      });
    });
  }, []);

  const handlePointerMove = useCallback((e: { clientX: number, clientY: number }) => {
    if (!selectedItem) return;
    if (!selectedItem.isDragging && Math.abs(e.clientX - selectedItem.startX) + Math.abs(e.clientY - selectedItem.startY) > 10) {
      setSelectedItem((prev) => prev && { ...prev, isDragging: true });
    }
    setItemStates((prev) => {
      return prev.map((itemState) => {
        if (itemState.id !== selectedItem.id) return itemState;
        return {
          ...itemState,
          target: {
            x: e.clientX - selectedItem.offsetX,
            y: e.clientY - selectedItem.offsetY,
            rotation: itemState.current.rotation,
          },
        };
      });
    });
  }, [selectedItem]);

  const handlePointerEnd = useCallback(() => {
    setItemStates((prevStates) => {
      const boardRect = boardRef.current?.getBoundingClientRect();
      setSelectedItem(null);
      if (!selectedItem || !boardRect) return prevStates;
      return prevStates.map((itemState) => {
        if (itemState.id !== selectedItem.id) {
          return itemState;
        }

        const maxX = (boardRect.width - selectedItem.width) / 2;
        const maxY = (boardRect.height - selectedItem.height) / 2;
        const currentItemState = itemState.current;
        let targetX = currentItemState.x;
        let targetY = currentItemState.y;
        let targetRotation = currentItemState.rotation;

        // TODO take rotation into account ?
        if (currentItemState.x < -maxX) {
          targetX = -maxX;
          targetRotation = bounceAngle(currentItemState.rotation);
        } else if (currentItemState.x > maxX) {
          targetX = maxX;
          targetRotation = bounceAngle(currentItemState.rotation);
        }

        if (currentItemState.y < -maxY) {
          targetY = -maxY;
          targetRotation = bounceAngle(currentItemState.rotation);
        } else if (currentItemState.y > maxY) {
          targetY = maxY;
          targetRotation = bounceAngle(currentItemState.rotation);
        }
        return {
          ...itemState,
          target: { x: targetX, y: targetY, rotation: targetRotation },
        };
      });
    });
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
      <CarouselIndicator
        total={itemStates.length}
        activeIndex={itemStates.findIndex(item => item.current.z === Math.max(...itemStates.map(item => item.current.z)))}
        onSelect={index => { setItemStates(prevStates => prevStates.map((item, i) => ({ ...item, current: { ...item.current, z: i === index ? Math.max(...prevStates.map(item => item.current.z)) + 1 : item.current.z } }))) }}
      />
    </div>
  );
};
