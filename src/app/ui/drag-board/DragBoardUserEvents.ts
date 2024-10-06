import { useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useRef } from "react";
import { enableOverscrollBehaviour, preventOverscrollBehaviour } from "../../utils/EventUtils";

export const useUserEvents = (
  dragBoardRef: React.RefObject<HTMLDivElement>,
  selectedItemId: string | null,
  onMove: (e: { clientX: number, clientY: number, rect: DOMRect }) => void,
  onEnd: () => void,
  onFlipThrough: (delta: number) => void,
) => {

  const scrollRef = useRef<number>(0);

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
      enableOverscrollBehaviour();
      onEnd();
    }

    if (selectedItemId !== null) {
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
  }, [selectedItemId, onMove, onEnd]);

  // flip through
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const startPosition = scrollRef.current;
      scrollRef.current += e.deltaY / 6;
      const delta = Math.round(startPosition - scrollRef.current)
      onFlipThrough(Math.round(delta));
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
  preventOverscrollBehaviour();
  return { clientX: position.clientX, clientY: position.clientY, rect: e.currentTarget.getBoundingClientRect() };
}
