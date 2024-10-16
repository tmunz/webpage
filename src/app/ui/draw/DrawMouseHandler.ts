export function useMouseHandler({ canvas, onPositionChanged, startPaint, endPaint, reset }: {
  canvas: HTMLCanvasElement | null,
  onPositionChanged: (position: { x: number; y: number }) => void,
  startPaint: (position: { x: number; y: number }) => void,
  endPaint: () => void,
  reset: () => void,
}) {

  if (!canvas) return () => { };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvas.getBoundingClientRect();
    onPositionChanged({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button === 0) {
      const rect = canvas.getBoundingClientRect();
      startPaint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      endPaint();
    }
  };

  const handleMouseUp = () => {
    endPaint();
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("dblclick", reset);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("dblclick", reset);
  };
}
