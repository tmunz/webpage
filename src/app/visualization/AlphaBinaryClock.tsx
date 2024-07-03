import React, { useEffect, useState } from 'react';

interface AlphaBinaryClockProps {
  backgroundDark?: boolean;
  fillColor?: string;
  borderColor?: string;
  relativeCornerRadius?: number;
  borderWidth?: number;
  borderPadding?: number;
  verticalSpace?: number;
  horizontalSpace?: number;
  hasBorder?: boolean;
  isBorderDate?: boolean;
  is24hStyle?: boolean;
}

const WINDOW_WIDTH = 144;
const WINDOW_HEIGHT = 168;

const DATE_TYPE = 0;
const TIME_TYPE = 1;

const MAX_ROWS = [6, 4, 6, 5, 6, 6];

const COLS = 3;
const YEAR_COL = 2;
const MONTH_COL = 1;
const DAY_COL = 0;
const HOURS_COL = 0;
const MINUTES_COL = 1;
const SECONDS_COL = 2;

export function AlphaBinaryClock({
  backgroundDark = true,
  fillColor = '#FFA500',
  borderColor = '#D3D3D3',
  relativeCornerRadius = 0.5,
  borderWidth = 2,
  borderPadding = 1,
  verticalSpace = 3,
  horizontalSpace = 10,
  hasBorder = true,
  isBorderDate = true,
  is24hStyle = true,
}: AlphaBinaryClockProps) {
  
  const DATE_CELL_SIZE = (WINDOW_HEIGHT - ((Math.max(...MAX_ROWS) - 1) * verticalSpace)) / Math.max(...MAX_ROWS);
  const TIME_CELL_SIZE = DATE_CELL_SIZE - (2 * (borderWidth + borderPadding));
  const HORIZONTAL_SIDE_PADDING = (WINDOW_WIDTH - (COLS * DATE_CELL_SIZE + (COLS - 1) * horizontalSpace)) / 2;

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = () => setTime(new Date());
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getCenterPointFromCellLocation = (i: number, j: number) => {
    const x = HORIZONTAL_SIDE_PADDING + i * (DATE_CELL_SIZE + horizontalSpace) + DATE_CELL_SIZE / 2;
    const y = WINDOW_HEIGHT - ((j + 0.5) * (DATE_CELL_SIZE + verticalSpace));
    return { x, y };
  };

  const getDisplayHour = (hour: number) => {
    if (is24hStyle) {
      return hour;
    }
    const displayHour = hour % 12;
    return hour % 24 === 0 ? 12 : displayHour;
  };

  const drawDateCell = (center: { x: number; y: number }, filled: boolean) => {
    if (filled) {
      const d = DATE_CELL_SIZE / 2;
      const innerD = DATE_CELL_SIZE / 2 - borderWidth;
      return (
        <>
          <rect
            x={center.x - d}
            y={center.y - d}
            width={DATE_CELL_SIZE}
            height={DATE_CELL_SIZE}
            rx={d * relativeCornerRadius}
            ry={d * relativeCornerRadius}
            fill={borderColor}
          />
          <rect
            x={center.x - innerD}
            y={center.y - innerD}
            width={DATE_CELL_SIZE - 2 * borderWidth}
            height={DATE_CELL_SIZE - 2 * borderWidth}
            rx={innerD * relativeCornerRadius}
            ry={innerD * relativeCornerRadius}
            fill={backgroundDark ? '#000000' : '#FFFFFF'}
          />
        </>
      );
    }
    return null;
  };

  const drawTimeCell = (center: { x: number; y: number }, filled: boolean) => {
    const d = TIME_CELL_SIZE / 2;
    const fill = filled ? fillColor : backgroundDark ? '#000000' : '#FFFFFF';
    return (
      <rect
        x={center.x - d}
        y={center.y - d}
        width={TIME_CELL_SIZE}
        height={TIME_CELL_SIZE}
        rx={d * relativeCornerRadius}
        ry={d * relativeCornerRadius}
        fill={fill}
      />
    );
  };

  const drawCol = (digit: number, type: number, col: number) => {
    const cells = [];
    for (let row = 0; row < MAX_ROWS[isBorderDate ? col : (col + 3)]; row++) {
      const center = getCenterPointFromCellLocation(col, row);
      const filled = (digit >> row) & 0x1 ? true : false;
      cells.push(
        type === DATE_TYPE
          ? drawDateCell(center, (isBorderDate && filled) || (!isBorderDate && hasBorder))
          : drawTimeCell(center, filled)
      );
    }
    return cells;
  };

  return (
    <svg width={WINDOW_WIDTH} height={WINDOW_HEIGHT} style={{ backgroundColor: backgroundDark ? 'black' : 'white' }}>
      {drawCol(time.getFullYear() % 100, DATE_TYPE, YEAR_COL)}
      {drawCol(time.getMonth() + 1, DATE_TYPE, MONTH_COL)}
      {drawCol(time.getDate(), DATE_TYPE, DAY_COL)}
      {drawCol(getDisplayHour(time.getHours()), TIME_TYPE, HOURS_COL)}
      {drawCol(time.getMinutes(), TIME_TYPE, MINUTES_COL)}
      {drawCol(time.getSeconds(), TIME_TYPE, SECONDS_COL)}
    </svg>
  );
};
