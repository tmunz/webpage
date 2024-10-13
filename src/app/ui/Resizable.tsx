import React, { useState, useRef } from 'react';

export interface ResizableProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

const THRESHOLD = 20;
const MAX = 9999999;
const R = MAX / -2;

export const Resizable = ({ width, height, children }: ResizableProps) => {
  const [size, setSize] = useState({ width, height });
  const [resizingCursor, setResizingCursor] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef('');

  const handleMouseDown = (e: React.MouseEvent, resizeDirection: string, cursor: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingCursor(cursor);
    directionRef.current = resizeDirection;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    let nextWidth = size.width;
    let nextHeight = size.height;

    if (directionRef.current.includes('right')) {
      nextWidth = e.clientX - rect.left;
    }
    if (directionRef.current.includes('left')) {
      nextWidth = rect.right - e.clientX;
    }
    if (directionRef.current.includes('bottom')) {
      nextHeight = e.clientY - rect.top;
    }
    if (directionRef.current.includes('top')) {
      nextHeight = rect.bottom - e.clientY;
    }

    setSize({
      width: Math.max(nextWidth, THRESHOLD),
      height: Math.max(nextHeight, THRESHOLD),
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingCursor(null);
    directionRef.current = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const directions = [
    { position: { top: -THRESHOLD / 2, left: -THRESHOLD / 2, width: '100%', height: THRESHOLD }, cursor: 'n-resize', direction: 'top' },
    { position: { top: -THRESHOLD / 2, right: -THRESHOLD / 2, width: THRESHOLD, height: '100%' }, cursor: 'e-resize', direction: 'right' },
    { position: { bottom: -THRESHOLD / 2, left: -THRESHOLD / 2, width: '100%', height: THRESHOLD }, cursor: 's-resize', direction: 'bottom' },
    { position: { top: -THRESHOLD / 2, left: -THRESHOLD / 2, width: THRESHOLD, height: '100%' }, cursor: 'w-resize', direction: 'left' },
    { position: { top: -THRESHOLD / 2, left: -THRESHOLD / 2, width: THRESHOLD, height: THRESHOLD }, cursor: 'nw-resize', direction: 'top-left' },
    { position: { top: -THRESHOLD / 2, right: -THRESHOLD / 2, width: THRESHOLD, height: THRESHOLD }, cursor: 'ne-resize', direction: 'top-right' },
    { position: { bottom: -THRESHOLD / 2, right: -THRESHOLD / 2, width: THRESHOLD, height: THRESHOLD }, cursor: 'se-resize', direction: 'bottom-right' },
    { position: { bottom: -THRESHOLD / 2, left: -THRESHOLD / 2, width: THRESHOLD, height: THRESHOLD }, cursor: 'sw-resize', direction: 'bottom-left' },
  ];

  return (
    <div
      className='resizable'
      ref={elementRef}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        position: 'relative',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {resizingCursor && <div style={{ position: 'fixed', zIndex: MAX, top: R, left: R, width: MAX, height: MAX, cursor: resizingCursor }} />}
      {children}
      {directions.map(({ position, cursor, direction }) => (
        <div
          key={direction}
          style={{ position: 'absolute', ...position, cursor, pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, direction, cursor)}
        />
      ))}
    </div>
  );
};