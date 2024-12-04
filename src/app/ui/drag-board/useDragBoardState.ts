import { useState, useEffect, useRef, ReactNode } from 'react';
import { DragBoardItemState } from './DragBoardItem';
import { SelectedDragBoardItem } from './SelectedDragBoardItem';


export const useDragBoardState = (
  children: ReactNode,
  placementPattern: { x: number, y: number, rotation: number }[],
  smoothness: number,
  mapChildrenToIds: (children: ReactNode) => string[]
) => {

  const [selectedItem, setSelectedItem] = useState<SelectedDragBoardItem | null>(null);
  const [itemStates, setItemStates] = useState<Map<string, DragBoardItemState>>(new Map());
  const [targetStates, setTargetStates] = useState<Map<string, DragBoardItemState>>(new Map());
  const lastSelectedItemPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
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
          id: key, ...placement, z: [...prevStates.values()].reduce((maxZ, itemState) => Math.max(maxZ, itemState.z), 0) + 1,
        });
      });
      return states;
    });
  }, [children, placementPattern]);

  useEffect(() => {
    if (selectedItem) {
      const item = itemStates.get(selectedItem.id);
      if (item) {
        lastSelectedItemPositionRef.current = { x: item.x, y: item.y };
      }
    }
  }, [itemStates, selectedItem]);

  const bringToFront = (id: string) => {
    updateItemOrder(1, id);
  }

  const bringToBack = (id: string) => {
    updateItemOrder(-1, id);
  }

  const updateItemOrder = (direction: -1 | 1, id?: string) => { 
    const sortedStates = Array.from(itemStates.values()).filter(v => v.id !== id).sort((a, b) => a.z - b.z);

    let itemState: DragBoardItemState | undefined;
    if (id !== undefined) {
      itemState = itemStates.get(id);
    } else {
      if (direction === -1) {
        itemState = sortedStates.pop();
      } else if (direction === 1) {
        itemState = sortedStates.shift();
      }
    }
    if (!itemState) return;

    direction === -1 ? sortedStates.unshift(itemState) : sortedStates.push(itemState);

    setTargetStates((prevStates) => {
      const updatedStates = new Map(prevStates);
      sortedStates.forEach((state, z) => {
        updatedStates.set(state.id, { ...state, ...prevStates.get(state.id), z });
      });
      return updatedStates;
    });
  };

  const handleSelectItem = (id: string, dragBoardItemRect: DOMRect | null, e: { clientX: number, clientY: number }) => {
    const itemState = itemStates.get(id);
    if (itemState) {
      setSelectedItem({
        id,
        offsetX: e.clientX - itemState.x,
        offsetY: e.clientY - itemState.y,
        width: dragBoardItemRect?.width ?? 0,
        height: dragBoardItemRect?.height ?? 0,
        startX: e.clientX,
        startY: e.clientY,
        isDragging: false,
        isResizing: false,
      });
      bringToFront(id);
    }
  };

  const updateItemState = (id: string, target: Partial<DragBoardItemState>) => {
    setTargetStates((prevStates) => {
      const targets = new Map(prevStates);
      const current = itemStates.get(id);
      if (current) {
        if (!targets.has(id)) { targets.set(id, current); }
        targets.set(id, { ...prevStates.get(id)!, ...target, id });
      }
      return targets;
    });
  };

  useEffect(() => {

    const calculatedUpdates = (current: DragBoardItemState, target?: DragBoardItemState): DragBoardItemState | null => {
      if (!target) return null;
      const x = current.x + (target.x !== undefined ? (target.x - current.x) / smoothness : 0);
      const y = current.y + (target.y !== undefined ? (target.y - current.y) / smoothness : 0);
      const z = target.z !== undefined ? target.z : current.z;
      const rotation = current.rotation + (target.rotation !== undefined ? (target.rotation - current.rotation) / smoothness : 0);
      const updateNeeded = Math.abs(x - current.x) > 0.1 || Math.abs(z - current.y) > 0.1 || Math.abs(rotation - current.rotation) > 0.1 || Math.abs(z - current.z) > 0.1;
      return updateNeeded ? { ...current, x, y, z, rotation } : null;
    };

    const update = () => {
      setItemStates((prevStates) => {
        const newStates = new Map(prevStates);
        const updates: DragBoardItemState[] = Array.from(prevStates.values())
          .map((itemState) => {
            const target = targetStates.get(itemState.id);
            return calculatedUpdates(itemState, target);
          })
          .filter((item): item is DragBoardItemState => item !== null);

        if (updates.length === 0) {
          animationFrameId.current = null;
          return prevStates;
        } else {
          updates.forEach((item) => newStates.set(item.id, { ...newStates.get(item.id), ...item }));
          return newStates;
        }
      });

      if (animationFrameId.current !== null) {
        animationFrameId.current = requestAnimationFrame(update);
      }
    };

    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [targetStates, smoothness]);


  return {
    itemStates,
    selectedItem,
    updateItemState,
    setSelectedItem: handleSelectItem,
    updateSelectedItem: setSelectedItem,
    bringToFront,
    bringToBack,
    updateItemOrder,
    lastSelectedItemPosition: lastSelectedItemPositionRef.current,
  };
};
