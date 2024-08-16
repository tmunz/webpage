export function useMouseHandler({ canvas, onPositionChanged, startPaint, endPaint, reset, onControlRequest }: {
  canvas: HTMLCanvasElement | null,
  onPositionChanged: (position: { x: number; y: number }) => void,
  startPaint: (position: { x: number; y: number }) => void,
  onControlRequest?: () => void,
  endPaint: () => void,
  reset: () => void,
}) {

  if (!canvas) return () => { };

  const handleMouseMove = (e: MouseEvent) => {
    onPositionChanged({ x: e.layerX, y: e.layerY });
  };

  const handleMouseDown = (e: MouseEvent) => {
    const { layerX, layerY, button } = e;
    if (button === 0) {
      startPaint({ x: layerX, y: layerY });
    } else {
      endPaint();
    }

    if (button === 2 && onControlRequest) {
      onControlRequest();
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
