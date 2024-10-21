import { useCallback } from 'react';
import { DragBoardItemState } from './DragBoardItem';
import { SelectedDragBoardItem } from './SelectedDragBoardItem';

const THRESHOLD = 10;

export const useDragEvents = (
  itemStates: Map<string, DragBoardItemState>,
  updateItemState: (id: string, itemState: Partial<DragBoardItemState>) => void,
  selectedItem: SelectedDragBoardItem | null,
  setSelectedItem: React.Dispatch<React.SetStateAction<SelectedDragBoardItem | null>>,
  boardRef: React.RefObject<HTMLDivElement>
) => {

  const handleDragging = useCallback((e: { clientX: number, clientY: number }) => {
    if (!selectedItem) return;
    if (!selectedItem.isDragging && Math.abs(e.clientX - selectedItem.startX) + Math.abs(e.clientY - selectedItem.startY) > THRESHOLD) {
      setSelectedItem((prev) => prev && { ...prev, isDragging: true });
    }
    updateItemState(selectedItem.id, {
      x: e.clientX - selectedItem.offsetX,
      y: e.clientY - selectedItem.offsetY,
    });
  }, [selectedItem]);

  const handleDragEnd = useCallback(() => {
    const boardRect = boardRef.current?.getBoundingClientRect();
    setSelectedItem(null);
    if (!selectedItem || !boardRect) return;
    const itemState = itemStates.get(selectedItem.id);
    if (!itemState) return;

    const maxX = (boardRect.width - selectedItem.width) / 2;
    const maxY = (boardRect.height - selectedItem.height) / 2;
    let targetX = itemState.x;
    let targetY = itemState.y;
    let targetRotation = itemState.rotation;

    if (itemState.x < -maxX) {
      targetX = -maxX;
      targetRotation = bounceAngle(itemState.rotation);
    } else if (itemState.x > maxX) {
      targetX = maxX;
      targetRotation = bounceAngle(itemState.rotation);
    }

    if (itemState.y < -maxY) {
      targetY = -maxY;
      targetRotation = bounceAngle(itemState.rotation);
    } else if (itemState.y > maxY) {
      targetY = maxY;
      targetRotation = bounceAngle(itemState.rotation);
    }

    updateItemState(selectedItem.id, { x: targetX, y: targetY, rotation: targetRotation });
  }, [selectedItem, itemStates, boardRef]);

  const bounceAngle = (angle: number) => {
    const referenceAngle = Math.round(angle / 90) * 90;
    const offAngle = angle - referenceAngle;
    return referenceAngle - offAngle;
  };

  return { handleDragging, handleDragEnd };
};
