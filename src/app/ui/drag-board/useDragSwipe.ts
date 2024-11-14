import { useState, useCallback } from 'react';
import { SelectedDragBoardItem } from './SelectedDragBoardItem';

const NULL_OVERFLOW = { top: 0, right: 0, bottom: 0, left: 0 };

export const useDragSwipe = (
  boardRef: React.RefObject<HTMLDivElement>,
  selectedItem: SelectedDragBoardItem | null,
  bringToBack: (id: string) => void,
  threshold: number = 0.5,
) => {
  const [dragSwipeProgress, setDragSwipeProgress] = useState(NULL_OVERFLOW);

  const calculateProgress = useCallback((selectedItem: SelectedDragBoardItem, e: { clientX: number; clientY: number; }) => {
    if (!boardRef.current) return NULL_OVERFLOW;
    const boardRect = boardRef.current.getBoundingClientRect();
    const calculateOverflow = (value: number, size: number) => {
      const itemThreshold = size * threshold;
      return Math.min(Math.max(0, value) / itemThreshold, 1);
    };
    const x = e.clientX - selectedItem.offsetX;
    const y = e.clientY - selectedItem.offsetY;
    const bw = boardRect.width / 2;
    const bh = boardRect.height / 2;
    return {
      top: calculateOverflow((selectedItem.height / 2 - y) - bh, selectedItem.height),
      right: calculateOverflow((selectedItem.width / 2 + x) - bw, selectedItem.width),
      bottom: calculateOverflow((selectedItem.height / 2 + y) - bh, selectedItem.height),
      left: calculateOverflow((selectedItem.width / 2 - x) - bw, selectedItem.width),
    };
  }, [boardRef, threshold]);

  const handleDragSwiping = useCallback(
    (e: { clientX: number; clientY: number; }) => {
      if (selectedItem !== null) {
        setDragSwipeProgress(calculateProgress(selectedItem, e));
      }
    },
    [calculateProgress, selectedItem]
  );

  const handleDragSwipeEnd = useCallback(() => {
    if (1 <= Math.max(...Object.values(dragSwipeProgress)) && selectedItem) {
      bringToBack(selectedItem?.id);
    };
    setDragSwipeProgress(NULL_OVERFLOW);
  }, [selectedItem, dragSwipeProgress]);

  return { dragSwipeProgress, handleDragSwiping, handleDragSwipeEnd };
};
