import { useCallback } from 'react';
import { DragBoardItemState } from './DragBoardItem';
import { SelectedDragBoardItem } from './SelectedDragBoardItem';

const THRESHOLD = 10;

export const useDragEvents = (
  setItemStates: React.Dispatch<React.SetStateAction<Map<string, DragBoardItemState>>>,
  selectedItem: SelectedDragBoardItem | null,
  setSelectedItem: React.Dispatch<React.SetStateAction<SelectedDragBoardItem | null>>,
  boardRef: React.RefObject<HTMLDivElement>
) => {

  const handleDragging = useCallback((e: { clientX: number, clientY: number }) => {
    if (!selectedItem) return;
    if (!selectedItem.isDragging && Math.abs(e.clientX - selectedItem.startX) + Math.abs(e.clientY - selectedItem.startY) > THRESHOLD) {
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

  const handleDragEnd = useCallback(() => {
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
  }, [selectedItem, boardRef]);

  const bounceAngle = (angle: number) => {
    const referenceAngle = Math.round(angle / 90) * 90;
    const offAngle = angle - referenceAngle;
    return referenceAngle - offAngle;
  };

  return { handleDragging, handleDragEnd };
};
