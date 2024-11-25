import { useEffect } from "react";
import { enableOverscrollBehaviour, preventOverscrollBehaviour } from "../../utils/EventUtils";

export const handlePointerEvents = (
  selectedItemId: string | null,
  onMove: (e: { clientX: number, clientY: number }) => void,
  onEnd: () => void,
) => {

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      onMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      onMove({
        clientX: e.clientX,
        clientY: e.clientY,
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
}


// called by the item itself
export const handleStart = (position: { clientX: number, clientY: number }) => {
  preventOverscrollBehaviour();
  return { clientX: position.clientX, clientY: position.clientY };
}
