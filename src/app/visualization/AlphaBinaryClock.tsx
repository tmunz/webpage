import React from 'react';
import { useDimension } from '../utils/useDimension';

export interface AlphaBinaryClockConfig {
  windowWidth?: number;
  windowHeight?: number;
  windowPadding?: number;
  backgroundColor?: string;
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

export interface AlphaBinaryClockProps extends AlphaBinaryClockConfig {
  dateTime: Date,
}

enum DatePart {
  DATE,
  TIME,
}

export function AlphaBinaryClock({
  dateTime,
  windowWidth,
  windowHeight,
  windowPadding = 2,
  backgroundColor = '#000000',
  fillColor = '#ff7403',
  borderColor = '#d3d3d3',
  relativeCornerRadius = 0.5,
  borderWidth = 2,
  borderPadding = 2,
  verticalSpace = 4,
  horizontalSpace = 12,
  hasBorder = true,
  isBorderDate = true,
  is24hStyle = true,
}: AlphaBinaryClockProps) {

  const elementRef = React.useRef<HTMLDivElement>(null);
  const size = useDimension(elementRef);
  windowWidth = windowWidth || size?.width || 144;
  windowHeight = windowHeight || size?.height || 168;
  const windowSize = Math.min(windowWidth, windowHeight);

  const MAX_ROWS = [6, 4, 6, is24hStyle ? 5 : 4, 6, 6];

  const COLS = 3;

  const DAY_COL = 0;
  const MONTH_COL = 1;
  const YEAR_COL = 2;

  const HOURS_COL = 0;
  const MINUTES_COL = 1;
  const SECONDS_COL = 2;

  const RELATIVE_VERTICAL_SPACE = verticalSpace * windowSize / 144;
  const RELATIVE_HORIZONTAL_SPACE = horizontalSpace * windowSize / 144;

  const DATE_CELL_SIZE = Math.min(
    (windowHeight - 2 * windowPadding - (Math.max(...MAX_ROWS) - 1) * RELATIVE_VERTICAL_SPACE) / Math.max(...MAX_ROWS),
    (windowWidth - 2 * windowPadding - ((COLS - 1) * RELATIVE_HORIZONTAL_SPACE)) / 3,
  );
  const RELATIVE_BORDER_WIDTH = borderWidth * DATE_CELL_SIZE / 32;
  const RELATIVE_BORDER_PADDING = borderPadding * DATE_CELL_SIZE / 32;
  const TIME_CELL_SIZE = DATE_CELL_SIZE - (2 * (RELATIVE_BORDER_WIDTH + RELATIVE_BORDER_PADDING));
  const HORIZONTAL_WINDOW_PADDING = (windowWidth - (COLS * DATE_CELL_SIZE + (COLS - 1) * RELATIVE_HORIZONTAL_SPACE)) / 2;
  const VERTICAL_WINDOW_PADDING = windowPadding;

  const getCenterPointFromCellLocation = (i: number, j: number) => {
    const x = HORIZONTAL_WINDOW_PADDING + i * (DATE_CELL_SIZE + RELATIVE_HORIZONTAL_SPACE) + DATE_CELL_SIZE / 2;
    const y = windowHeight - VERTICAL_WINDOW_PADDING - ((j + 0.5) * (DATE_CELL_SIZE + RELATIVE_VERTICAL_SPACE));
    return { x, y };
  };

  const getDisplayHour = (hour: number) => {
    if (is24hStyle) {
      return hour;
    }
    const displayHour = hour % 12;
    return hour % 12 === 0 ? 12 : displayHour;
  };

  const drawDateCell = (center: { x: number; y: number }, filled: boolean) => {
    if (filled) {
      const d = DATE_CELL_SIZE / 2;
      const innerD = DATE_CELL_SIZE / 2 - RELATIVE_BORDER_WIDTH;
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
            width={DATE_CELL_SIZE - 2 * RELATIVE_BORDER_WIDTH}
            height={DATE_CELL_SIZE - 2 * RELATIVE_BORDER_WIDTH}
            rx={innerD * relativeCornerRadius}
            ry={innerD * relativeCornerRadius}
            fill={backgroundColor}
          />
        </>
      );
    }
    return null;
  };

  const drawTimeCell = (center: { x: number; y: number }, filled: boolean) => {
    const d = TIME_CELL_SIZE / 2;
    const fill = filled ? fillColor : backgroundColor;
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

  const drawCol = (digit: number, type: DatePart, col: number) => {
    const cells = [];
    for (let row = 0; row < (isBorderDate ? Math.max(...MAX_ROWS) : MAX_ROWS[col + COLS]); row++) {
      const center = getCenterPointFromCellLocation(col, row);
      const filled = (digit >> row) & 0x1 ? true : false;
      cells.push(
        type === DatePart.DATE
          ? drawDateCell(center, (isBorderDate && filled) || (!isBorderDate && hasBorder))
          : drawTimeCell(center, filled)
      );
    }
    return cells;
  };

  return (
    <div ref={elementRef} style={{ width: '100%', height: '100%' }}>
      <svg width={windowWidth} height={windowHeight} style={{ backgroundColor }}>
        {drawCol(dateTime.getFullYear() % 100, DatePart.DATE, YEAR_COL)}
        {drawCol(dateTime.getMonth() + 1, DatePart.DATE, MONTH_COL)}
        {drawCol(dateTime.getDate(), DatePart.DATE, DAY_COL)}
        {drawCol(getDisplayHour(dateTime.getHours()), DatePart.TIME, HOURS_COL)}
        {drawCol(dateTime.getMinutes(), DatePart.TIME, MINUTES_COL)}
        {drawCol(dateTime.getSeconds(), DatePart.TIME, SECONDS_COL)}
      </svg>
    </div>
  );
};
