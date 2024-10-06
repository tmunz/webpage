import './DragBoard.styl';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragBoardItemContext, DragBoardItemState } from './DragBoardItem';
import { useUserEvents } from './DragBoardUserEvents';
import { CarouselIndicator } from '../CarouselIndicator';
import { max } from 'd3';

export interface DragBoardProps {
  children: React.ReactNode;
  className?: string;
  placementPattern?: { x: number, y: number, rotation: number }[];
  indicator?: boolean;
}

// positions are relative to the center of the board with axle directions to the right and down
export const DragBoard = ({ children, className, placementPattern = [{ x: 0, y: 0, rotation: 0 }], indicator = false }: DragBoardProps) => {
  const SMOOTHNESS = 10;

  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
    isDragging: boolean;
  } | null>(null);

  const [itemStates, setItemStates] = useState<Map<string, DragBoardItemState>>(new Map());
  const animationFrameId = useRef<number | null>(null);

  const mapChildrenToIds = (children: React.ReactNode): string[] => {
    return React.Children.map(children, (child, i) => ((child as React.ReactElement).key ?? i).toString()) ?? [];
  }

  useEffect(() => {
    setItemStates((prevStates) => {
      const states = new Map<string, DragBoardItemState>(prevStates);
      const childrenIds = mapChildrenToIds(children);
      for (const key of itemStates.keys()) {
        if (!childrenIds.includes(key)) {
          states.delete(key);
        }
      }

      childrenIds.forEach((key, i) => {
        if (states.has(key)) return
        const placement = placementPattern[i % placementPattern.length];
        states.set(key, {
          id: key,
          current: {
            ...placement, z: i
          },
          target: {},
        });
      });
      return states;
    });
  }, [children]);

  useEffect(() => {
    const updatePosition = () => {
      setItemStates((prevStates) => {
        let needsUpdate = false;
        const states = new Map<string, DragBoardItemState>(prevStates);

        prevStates.forEach((itemState, key) => {
          const current = itemState.current;
          const target = itemState.target;

          const newX = current.x + (target.x !== undefined ? (target.x - current.x) / SMOOTHNESS : 0);
          const newY = current.y + (target.y !== undefined ? (target.y - current.y) / SMOOTHNESS : 0);
          const newRotation = current.rotation + (target.rotation !== undefined ? (target.rotation - current.rotation) / SMOOTHNESS : 0);

          if (Math.abs(newX - current.x) > 0.1 || Math.abs(newY - current.y) > 0.1 || Math.abs(newRotation - current.rotation) > 0.1) {
            needsUpdate = true;
            states.set(key, {
              ...itemState,
              current: {
                ...current,
                x: newX,
                y: newY,
                rotation: newRotation,
              },
            });
          }
        });
        return needsUpdate ? states : prevStates;
      });
      if (animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(updatePosition);
      }
    };
    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handlePointerDown = useCallback((id: string, e: { clientX: number, clientY: number, rect: DOMRect }) => {

    setItemStates((prevStates) => {
      const maxZ = Math.max(...Array.from(prevStates.values()).map((item) => item.current.z));
      const states = new Map(prevStates);
      const itemState = states.get(id);

      if (itemState) {
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

        states.set(id, { ...itemState, current: { ...itemState.current, z: maxZ + 1 } });
      }
      return states;
    });

  }, []);

  const handlePointerMove = useCallback((e: { clientX: number, clientY: number }) => {
    if (!selectedItem) return;
    if (!selectedItem.isDragging && Math.abs(e.clientX - selectedItem.startX) + Math.abs(e.clientY - selectedItem.startY) > 10) {
      setSelectedItem((prev) => prev && { ...prev, isDragging: true });
    }

    setItemStates((prevStates) => {
      const states = new Map(prevStates);
      const itemState = states.get(selectedItem.id);

      if (itemState) {
        states.set(selectedItem.id, {
          ...itemState,
          target: {
            x: e.clientX - selectedItem.offsetX,
            y: e.clientY - selectedItem.offsetY,
            rotation: itemState.current.rotation,
          },
        });
      }
      return states;
    });
  }, [selectedItem]);

  const handlePointerEnd = useCallback(() => {
    setItemStates((prevStates) => {
      const boardRect = boardRef.current?.getBoundingClientRect();
      setSelectedItem(null);
      if (!selectedItem || !boardRect) return prevStates;
      const newState = new Map(prevStates);
      const itemState = newState.get(selectedItem.id);

      if (itemState) {
        const maxX = (boardRect.width - selectedItem.width) / 2;
        const maxY = (boardRect.height - selectedItem.height) / 2;
        const currentItemState = itemState.current;
        let targetX = currentItemState.x;
        let targetY = currentItemState.y;
        let targetRotation = currentItemState.rotation;

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

        newState.set(selectedItem.id, {
          ...itemState,
          target: { x: targetX, y: targetY, rotation: targetRotation },
        });
      }
      return newState;
    });
  }, [selectedItem]);

  const bounceAngle = (angle: number) => {
    const referenceAngle = Math.round(angle / 90) * 90;
    const offAngle = angle - referenceAngle;
    return referenceAngle - offAngle;
  };

  const handleScroll = useCallback((delta: number) => {
    setItemStates((prevStates) => {
      const sortedStates = Array.from(prevStates.values()).sort((a, b) => a.current.z - b.current.z);
      const minZ = sortedStates[0]?.current.z;
      const maxZ = sortedStates[sortedStates.length - 1]?.current.z;

      const states = new Map(prevStates);
      if (delta < 0) {
        const minId = sortedStates[0]?.id;
        if (minId) {
          states.set(minId, {
            ...states.get(minId)!,
            current: { ...states.get(minId)!.current, z: maxZ + 1 },
          });
        }
      } else {
        const maxId = sortedStates[sortedStates.length - 1]?.id;
        if (maxId) {
          states.set(maxId, {
            ...states.get(maxId)!,
            current: { ...states.get(maxId)!.current, z: minZ - 1 },
          });
        }
      }

      return states;
    });
  }, []);

  const getIndicator = () => {
    const getIndicatorData = () => {
      const sortedItemIds = mapChildrenToIds(children);
      const maxZ = Math.max(...[...itemStates.values()].map(item => item.current.z));
      return { sortedItemIds, maxZ }
    };

    const { sortedItemIds, maxZ } = getIndicatorData();

    return <CarouselIndicator
      total={itemStates.size}
      activeIndex={sortedItemIds.findIndex(id => itemStates.get(id)?.current.z === maxZ)}
      onSelect={index => {
        setItemStates(prevStates => {
          const newState = new Map(prevStates);
          const { sortedItemIds, maxZ } = getIndicatorData();
          const targetId = sortedItemIds[index];
          if (targetId) {
            newState.set(targetId, {
              ...newState.get(targetId)!,
              current: { ...newState.get(targetId)!.current, z: maxZ + 1 }
            });
          }
          return newState;
        });
      }}
    />
  };

  useUserEvents(boardRef, selectedItem?.id ?? null, handlePointerMove, handlePointerEnd, handleScroll);

  return (
    <div className={`drag-board ${className ? className : ''}`} ref={boardRef}>
      {React.Children.map(children, (child, i) => {
        const itemState = itemStates.get(((child as React.ReactElement).key ?? i).toString()) ?? null;
        if (!itemState) return null

        return (
          <DragBoardItemContext.Provider value={{
            ...itemState,
            isDragging: (selectedItem?.id === itemState?.id && selectedItem?.isDragging) ?? false,
            onPointerDown: handlePointerDown
          }}>
            {child}
          </DragBoardItemContext.Provider>
        );
      })}
      {indicator && getIndicator()}
    </div>
  );
};
