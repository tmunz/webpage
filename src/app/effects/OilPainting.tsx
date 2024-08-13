import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AvgCalculator } from "../utils/AvgCalculator";
import { HistoryManager } from "../utils/HistoryManager";

interface OilPaintingProps {
  color?: { r: number, g: number, b: number };
  distribution?: number;
  strokeWidth?: number;
  maxSprankleSize?: number;
}

export const OilPainting = forwardRef(
  function OilPainting({ color = { r: 0, g: 0, b: 0 }, strokeWidth = 10, maxSprankleSize = 10, distribution = 10 }: OilPaintingProps, ref) {

    const [size, setSize] = useState({ width: 1, height: 1 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const intervalRef = useRef<number | null>(null);
    const { current: avgCalculator } = useRef(AvgCalculator(20, strokeWidth));
    const { current: history } = useRef<ReturnType<typeof HistoryManager<ImageData>>>(HistoryManager<ImageData>(25, [new ImageData(1, 1)]));
    const { current: currPosition } = useRef({ x: size.width / 2, y: size.height / 2 });
    const prevPosition = useRef<{ x: number, y: number } | null>(null);
    let paintMode = false;


    const undo = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (history.canUndo() && context) {
        history.undo();
        const current = history.getCurrent();
        if (current) {
          reset();
          context.putImageData(current, 0, 0);
        }
      }
    };

    const redo = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (history.canRedo() && context) {
        history.redo();
        const current = history.getCurrent();
        if (current) {
          reset();
          context.putImageData(current, 0, 0);
        }
      }
    };

    const reset = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        context.clearRect(0, 0, size.width, size.height);
      }
    };

    const canUndo = () => {
      return history.canUndo();
    };

    const canRedo = () => {
      return history.canRedo();
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      if (canvas && context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        const maxSprankle = (maxSprankleSize ?? 1) * 10;

        const paint = () => {
          if (paintMode) {
            if (prevPosition.current !== null) {
              avgCalculator.push(
                Math.sqrt((prevPosition.current.x - currPosition.x) ** 2 + (prevPosition.current.y - currPosition.y) ** 2)
              );
              const avgDistance = avgCalculator.avg();

              context.beginPath();
              context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
              context.lineWidth = Math.max(1, strokeWidth / Math.max(1, avgCalculator.avg()));
              context.moveTo(prevPosition.current.x, prevPosition.current.y);
              context.quadraticCurveTo(prevPosition.current.x, prevPosition.current.y, currPosition.x, currPosition.y);
              context.stroke();
              context.closePath();

              for (let i = 0; i < (avgDistance / 5) ** 2; i += 1) {
                const randomSprankleDistributionVector = [0, 1].map(() =>
                  (distribution ?? 1) * avgDistance * (Math.random() - 0.5)
                );
                context.beginPath();
                context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.random() / 2 + 0.3})`;
                context.lineWidth = Math.min(maxSprankle, Math.random() * maxSprankle / avgDistance);
                context.moveTo(
                  currPosition.x + randomSprankleDistributionVector[0],
                  currPosition.y + randomSprankleDistributionVector[1]
                );
                context.lineTo(
                  currPosition.x + randomSprankleDistributionVector[0],
                  currPosition.y + randomSprankleDistributionVector[1]
                );
                context.stroke();
                context.closePath();
              }
            }

            prevPosition.current = { x: currPosition.x, y: currPosition.y };
          }
        };

        const startPaint = (position: { x: number; y: number }) => {
          prevPosition.current = null;
          currPosition.x = position.x;
          currPosition.y = position.y;
          avgCalculator.reset();
          paintMode = true;
          if (intervalRef.current === null) {
            intervalRef.current = window.setInterval(paint, 1000 / 60);
          }
        };

        const stopPaint = () => {
          paintMode = false;
          clearPaintInterval();
        };

        const clearPaintInterval = () => {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };

        const saveState = () => {
          if (canvas) {
            history.push(context.getImageData(0, 0, canvas.width, canvas.height));
          }
        };

        const handleMouseMove = (e: MouseEvent) => {
          currPosition.x = e.layerX;
          currPosition.y = e.layerY;
        };

        const handleMouseDown = (e: MouseEvent) => {
          startPaint({ x: e.layerX, y: e.layerY });
        };

        const handleMouseUp = (e: MouseEvent) => {
          saveState();
          stopPaint();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
          e.preventDefault();
          if (e.ctrlKey && e.key === "z") {
            undo();
          } else if (e.ctrlKey && e.key === "y") {
            redo();
          } else if (e.key === "Delete" || e.key === "Backspace") {
            reset();
          }
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("dblclick", reset);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mousedown", handleMouseDown);
          canvas.removeEventListener("mouseup", handleMouseUp);
          canvas.removeEventListener("dblclick", reset);
          window.removeEventListener("keydown", handleKeyDown);
          clearPaintInterval();
        };
      }
    }, [canvasRef.current, size, distribution, color, strokeWidth, maxSprankleSize]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.contentBoxSize) {
            const width = entry.contentRect.width;
            const height = entry.contentRect.height;
            setSize({ width, height });
          }
        }
      });

      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.unobserve(canvas);
      };
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const current = history.getCurrent();
      if (canvas && context && current) {
        context.clearRect(0, 0, size.width, size.height);
        context.putImageData(current, 0, 0);
      }
    }, [size]);

    useImperativeHandle(ref, () => ({
      undo, redo, reset, canUndo, canRedo,
    }));

    return <canvas ref={canvasRef} className="oil-painting" width={size.width} height={size.height} />;
  });
