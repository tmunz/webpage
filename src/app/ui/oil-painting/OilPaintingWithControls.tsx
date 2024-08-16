import './OilPaintingWithControls.styl';

import React, { useRef, useState } from 'react';
import { OilPainting } from './OilPainting';

export const OilPaintingWithControls = () => {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [distribution, setDistribution] = useState(10);
  const [strokeWidth, setStrokeWidth] = useState(50);
  const [maxSprankleSize, setMaxSprankleSize] = useState(5);
  const oilPaintingRef = useRef<{ undo: () => void; redo: () => void; reset: () => void }>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    setColor({
      r: parseInt(hexColor.slice(1, 3), 16),
      g: parseInt(hexColor.slice(3, 5), 16),
      b: parseInt(hexColor.slice(5, 7), 16),
    });
  };

  return (
    <div className={`oil-painting-with-controls`}>
      <div className="controls">
        <input type="color" onChange={handleColorChange} />
        <label>
          Distribution:
          <input
            type="number"
            value={distribution}
            onChange={(e) => setDistribution(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Stroke Width:
          <input
            type="number"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Max Sprankle Size:
          <input
            type="number"
            value={maxSprankleSize}
            onChange={(e) => setMaxSprankleSize(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={() => oilPaintingRef.current?.undo()}>Undo</button>
        <button onClick={() => oilPaintingRef.current?.redo()}>Redo</button>
        <button onClick={() => oilPaintingRef.current?.reset()}>Reset</button>
      </div>
      <OilPainting
        ref={oilPaintingRef}
        color={color}
        distribution={distribution}
        strokeWidth={strokeWidth}
        maxSprankleSize={maxSprankleSize}
      />
    </div>
  );
};
