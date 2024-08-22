import { useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";

export const useUserEvents = (
  dragBoardRef: React.RefObject<HTMLDivElement>,
  selectedItem: number | null,
  onMove: (e: { clientX: number, clientY: number, rect: DOMRect }) => void,
  onEnd: () => void,
  onFlipThrough: (delta: number) => void,
) => {

  // item dragging
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      onMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
        rect: (e.target as HTMLElement)?.getBoundingClientRect(),
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      onMove({
        clientX: e.clientX,
        clientY: e.clientY,
        rect: (e.target as HTMLElement)?.getBoundingClientRect(),
      });
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      document.body.style.overscrollBehavior = 'auto';
      onEnd();
    }

    if (selectedItem !== null) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('mouseup', handleEnd);
    } else {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mouseup', handleEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [selectedItem, onMove, onEnd]);

  // flip through
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      onFlipThrough(Math.sign(e.deltaY));
    }

    const dragBoard = dragBoardRef.current;
    if (dragBoard) {
      dragBoard.addEventListener('wheel', handleScroll);
    }

    return () => {
      dragBoardRef.current?.removeEventListener('wheel', handleScroll);
    };

  }, [dragBoardRef.current, onFlipThrough]);
}


// called by the item itself
export const handleStart = (position: { clientX: number, clientY: number }, e: ReactMouseEvent | ReactTouchEvent) => {
  e.preventDefault();
  document.body.style.overscrollBehavior = 'none';
  return { clientX: position.clientX, clientY: position.clientY, rect: e.currentTarget.getBoundingClientRect() };
}
