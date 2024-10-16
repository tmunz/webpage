import { enableOverscrollBehaviour, preventOverscrollBehaviour } from "../../utils/EventUtils";

export function useTouchHandler({ canvas, onPositionChanged, startPaint, endPaint }: {
  canvas: HTMLCanvasElement | null,
  onPositionChanged: (position: { x: number; y: number }) => void,
  startPaint: (position: { x: number; y: number }) => void,
  endPaint: () => void,
}) {

  if (!canvas) return () => {};

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    onPositionChanged({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    preventOverscrollBehaviour();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startPaint({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  };

  const handleTouchEnd = () => {
    enableOverscrollBehaviour();
    endPaint();
  };

  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchend", handleTouchEnd);

  return () => {
    canvas.removeEventListener("touchstart", handleTouchStart);
    canvas.removeEventListener("touchmove", handleTouchMove);
    canvas.removeEventListener("touchend", handleTouchEnd);
  };
}
