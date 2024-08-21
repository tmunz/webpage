import './OilPaintingWithControls.styl';
import React, { useRef, useState, MouseEvent } from 'react';
import { OilPainting } from './OilPainting';
import { PieMenu } from '../PieMenu';


const CONTROL_SIZE = 200

export const OilPaintingWithControls = ({ width, height }: { width: number, height: number }) => {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [distribution, setDistribution] = useState(10);
  const [strokeWidth, setStrokeWidth] = useState(50);
  const [maxSprankleSize, setMaxSprankleSize] = useState(5);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [controlsPosition, setControlsPosition] = useState({ x: 0, y: 0 });
  const oilPaintingRef = useRef<{ undo: () => void; redo: () => void; reset: () => void }>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    setColor({
      r: parseInt(hexColor.slice(1, 3), 16),
      g: parseInt(hexColor.slice(3, 5), 16),
      b: parseInt(hexColor.slice(5, 7), 16),
    });
  };

  const handleControlRequest = (e: MouseEvent, rect?: DOMRect) => {
    e.preventDefault();
    const x = Math.min(Math.max(CONTROL_SIZE / 2, e.clientX - (rect?.left ?? 0)), (rect?.width ?? CONTROL_SIZE) - CONTROL_SIZE / 2);
    const y = Math.min(Math.max(CONTROL_SIZE / 2, e.clientY - (rect?.top ?? 0)), (rect?.height ?? CONTROL_SIZE) - CONTROL_SIZE / 2);
    setControlsPosition({ x, y });
    setControlsVisible(true);
  };

  const closeControls = () => {
    setControlsVisible(false);
  };

  return (
    <div className="oil-painting-with-controls">
      {controlsVisible && (
        <div
          className="controls"
          style={{ top: controlsPosition.y, left: controlsPosition.x }}
        >
          <PieMenu size={CONTROL_SIZE} innerCircleRatio={0.3}>
            <button onClick={() => oilPaintingRef.current?.reset()}>🗌</button>
            <button onClick={() => oilPaintingRef.current?.redo()}>⎘</button>
            <input type="color" onChange={handleColorChange} />
            <label>
              <span>|</span>
              <input
                type="number"
                value={strokeWidth}
                min={1}
                max={99}
                onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
              />
            </label>
            <label>
              <span>◌⃓</span>
              <input
                type="number"
                value={maxSprankleSize}
                min={0}
                max={20}
                onChange={(e) => setMaxSprankleSize(parseFloat(e.target.value))}
              />
            </label>
            <label>
              <span>◌⃡</span>
              <input
                type="number"
                value={distribution}
                min={0}
                max={20}
                onChange={(e) => setDistribution(parseFloat(e.target.value))}
              />
            </label>
            <button onClick={() => oilPaintingRef.current?.undo()}>⎗</button>

          </PieMenu>
          <button className="close-controls" onClick={closeControls}>✖</button>
        </div>
      )}
      <OilPainting
        ref={oilPaintingRef}
        width={width}
        height={height}
        color={color}
        distribution={distribution}
        strokeWidth={strokeWidth}
        maxSprankleSize={maxSprankleSize}
        onControlRequest={handleControlRequest}
      />
    </div>
  );
};
