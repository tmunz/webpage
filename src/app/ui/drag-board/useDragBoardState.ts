import { useState, useEffect, useRef, ReactNode } from 'react';
import { DragBoardItemState } from './DragBoardItem';
import { SelectedDragBoardItem } from './SelectedDragBoardItem';


export const useDragBoardState = (
  children: ReactNode,
  placementPattern: { x: number, y: number, rotation: number }[],
  smoothness: number,
  mapChildrenToIds: (children: ReactNode) => string[]
) => {

  const [itemStates, setItemStates] = useState<Map<string, DragBoardItemState>>(new Map());
  const animationFrameId = useRef<number | null>(null);

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
  }, [children, placementPattern]);

  useEffect(() => {
    const updatePosition = () => {
      setItemStates((prevStates) => {
        let needsUpdate = false;
        const states = new Map<string, DragBoardItemState>(prevStates);

        prevStates.forEach((itemState, key) => {
          const current = itemState.current;
          const target = itemState.target;

          const newX = current.x + (target.x !== undefined ? (target.x - current.x) / smoothness : 0);
          const newY = current.y + (target.y !== undefined ? (target.y - current.y) / smoothness : 0);
          const newRotation = current.rotation + (target.rotation !== undefined ? (target.rotation - current.rotation) / smoothness : 0);

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
  }, [smoothness]);

  return { itemStates, setItemStates };
};
