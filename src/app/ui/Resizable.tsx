import React, { useState, useRef } from 'react';

export interface ResizableProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

const THRESHOLD = 10;

export const Resizable = ({ width, height, children }: ResizableProps) => {
  const [size, setSize] = useState({ width, height });
  const elementRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const directionRef = useRef('');

  const handleMouseDown = (e: React.MouseEvent, resizeDirection: string) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    directionRef.current = resizeDirection;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isResizing.current || !elementRef.current) return;

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
    isResizing.current = false;
    directionRef.current = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };


  const setCursorStyle = (e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    const directionX = clientX - rect.left < THRESHOLD ? 'left' : clientX > rect.right - THRESHOLD ? 'right' : '';
    const directionY = clientY - rect.top < THRESHOLD ? 'top' : clientY > rect.bottom - THRESHOLD ? 'bottom' : '';
    const cursorStyle = `${directionY}${directionX ? '-' : ''}${directionX}`;

    elementRef.current.style.cursor = cursorStyle ? `${cursorStyle}-resize` : 'default';
  };

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
      onMouseMove={setCursorStyle}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `${THRESHOLD}px solid green`,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${THRESHOLD}px`, cursor: 'n-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'top')}
        />
        <div
          style={{ position: 'absolute', top: 0, right: 0, width: `${THRESHOLD}px`, height: '100%', cursor: 'e-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
        />
        <div
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${THRESHOLD}px`, cursor: 's-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        />
        <div
          style={{ position: 'absolute', top: 0, left: 0, width: `${THRESHOLD}px`, height: '100%', cursor: 'w-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'left')}
        />
        <div
          style={{ position: 'absolute', top: 0, left: 0, width: `${THRESHOLD}px`, height: `${THRESHOLD}px`, cursor: 'nw-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'top-left')}
        />
        <div
          style={{ position: 'absolute', top: 0, right: 0, width: `${THRESHOLD}px`, height: `${THRESHOLD}px`, cursor: 'ne-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'top-right')}
        />
        <div
          style={{ position: 'absolute', bottom: 0, right: 0, width: `${THRESHOLD}px`, height: `${THRESHOLD}px`, cursor: 'se-resize', pointerEvents: 'auto' }}

          onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
        />
        <div
          style={{ position: 'absolute', bottom: 0, left: 0, width: `${THRESHOLD}px`, height: `${THRESHOLD}px`, cursor: 'sw-resize', pointerEvents: 'auto' }}
          onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
        />
      </div>
    </div>
  );
};