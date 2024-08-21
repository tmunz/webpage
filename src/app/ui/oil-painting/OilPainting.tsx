import React, { forwardRef, MouseEvent, useEffect, useImperativeHandle, useRef } from "react";
import { AvgCalculator } from "../../utils/AvgCalculator";
import { HistoryManager } from "../../utils/HistoryManager";
import { useMouseHandler } from "./OilPaintingMouseHandler";
import { useTouchHandler } from "./OilPaintingTouchHandler";
import { useKeyboardHandler } from "./OilPaintingKeyboardHandler";


interface OilPaintingProps {
  width: number,
  height: number,
  color?: { r: number, g: number, b: number };
  distribution?: number;
  strokeWidth?: number;
  maxSprankleSize?: number;
  onControlRequest?: (event: MouseEvent, rect?: DOMRect) => void;
}

export const OilPainting = forwardRef(
  function OilPainting({ width, height, color = { r: 0, g: 0, b: 0 }, strokeWidth = 10, maxSprankleSize = 10, distribution = 10, onControlRequest }: OilPaintingProps, ref) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const intervalRef = useRef<number | null>(null);
    const { current: avgCalculator } = useRef(AvgCalculator(20, strokeWidth));
    const { current: history } = useRef<ReturnType<typeof HistoryManager<ImageData>>>(HistoryManager<ImageData>(25, [new ImageData(1, 1)]));
    const { current: currPosition } = useRef({ x: width / 2, y: height / 2 });
    const prevPositionRef = useRef<{ x: number, y: number } | null>(null);

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
        context.clearRect(0, 0, width, height);
      }
    };

    const useBrush = (context: CanvasRenderingContext2D, from: { x: number, y: number }, to: { x: number, y: number }, params: { color: string, width: number }) => {
      context.lineCap = "round";
      context.lineJoin = "round"; ''
      context.strokeStyle = params.color;
      context.lineWidth = params.width;
      context.moveTo(from.x, from.y);
      context.quadraticCurveTo(from.x, from.y, to.x, to.y);
      context.stroke();
    }

    const paint = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const prevPosition = prevPositionRef.current;

      if (canvas && context && paintMode && prevPosition !== null) {

        const maxSprankle = (maxSprankleSize ?? 1) * 10;

        avgCalculator.push(
          Math.sqrt((prevPosition.x - currPosition.x) ** 2 + (prevPosition.y - currPosition.y) ** 2)
        );
        const avgDistance = avgCalculator.avg();

        context.beginPath();
        useBrush(context, prevPosition, currPosition, { color: `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`, width: Math.max(1, strokeWidth / Math.max(1, avgCalculator.avg())) });
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

      prevPositionRef.current = { x: currPosition.x, y: currPosition.y };
    };

    const setPosition = (position: { x: number; y: number }) => {
      currPosition.x = position.x;
      currPosition.y = position.y;
    }

    const startPaint = (position: { x: number; y: number }) => {
      prevPositionRef.current = null;
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
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (canvas && context) {
        history.push(context.getImageData(0, 0, canvas.width, canvas.height));
      }
    };

    const endPaint = () => {
      saveState();
      stopPaint();
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      if (canvas && context) {
        const keyboardHandler = useKeyboardHandler({ undo, redo, reset });
        const mouseHandler = useMouseHandler({ canvas, onPositionChanged: setPosition, startPaint, endPaint, reset });
        const touchHandler = useTouchHandler({ canvas, onPositionChanged: setPosition, startPaint, endPaint });

        return () => {
          keyboardHandler();
          mouseHandler();
          touchHandler();
          clearPaintInterval();
        };
      }
    }, [canvasRef.current, width, height, distribution, color, strokeWidth, maxSprankleSize]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const current = history.getCurrent();
      if (canvas && context && current) {
        context.clearRect(0, 0, width, height);
        context.putImageData(current, 0, 0);
      }
    }, [width, height]);

    useImperativeHandle(ref, () => ({
      undo, redo, reset, canUndo: history.canUndo, canRedo: history.canRedo,
    }));

    return <canvas ref={canvasRef} className="oil-painting" width={width} height={height} style={{ width, height }} onContextMenu={(e) => onControlRequest?.(e, canvasRef.current?.getBoundingClientRect())} />;
  });
