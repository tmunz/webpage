import { useEffect, useRef } from "react";

export const useFlipThrough = (
  dragBoardRef: React.RefObject<HTMLDivElement>,
  onFlipThrough: (direction: -1 | 1) => void,
) => {
  const lastScrollTimeRef = useRef(0);
  const scrollDelay = 150;

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) {
        return;
      }
      lastScrollTimeRef.current = now;
      const direction = Math.sign(e.deltaY) as -1 | 0 | 1;
      if (direction !== 0) {
        onFlipThrough(direction);
      }
    };

    const dragBoard = dragBoardRef.current;
    if (dragBoard) {
      dragBoard.addEventListener('wheel', handleScroll);
    }

    return () => {
      dragBoardRef.current?.removeEventListener('wheel', handleScroll);
    };

  }, [dragBoardRef.current, onFlipThrough]);
}
