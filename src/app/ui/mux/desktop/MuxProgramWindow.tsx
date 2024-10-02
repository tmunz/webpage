import './MuxProgramWindow.styl';
import React, { useState, useEffect } from 'react';
import { MuxProgram } from '../MuxProgram';
import { MuxOs } from '../MuxOs';
import { MuxProgramWindowBar } from './MuxProgramWindowBar';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MuxProgramWindow = ({ program, rect }: { program: MuxProgram, rect: Rect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
  const [rectStart, setRectStart] = useState<Rect>(rect);

  const muxOs = MuxOs.get();

  const onChange = (newRect: Rect) => {
    muxOs.changeProgramWindow(program.id, newRect);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setMouseStart({ x: e.clientX, y: e.clientY });
    setRectStart(rect);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - mouseStart.x;
      const deltaY = e.clientY - mouseStart.y;
      onChange({ ...rectStart, x: rectStart.x + deltaX, y: rectStart.y + deltaY });
    } else if (isResizing) {
      const deltaX = e.clientX - mouseStart.x;
      const deltaY = e.clientY - mouseStart.y;
      onChange({
        ...rectStart,
        width: Math.max(100, rectStart.width + deltaX),
        height: Math.max(100, rectStart.height + deltaY),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    setMouseStart({ x: e.clientX, y: e.clientY });
    setRectStart(rect); // Save the initial size
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div
      className="mux-program-window"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        position: 'absolute',
      }}
    >
      <MuxProgramWindowBar
        title={program.name}
        about={program.about}
        onClose={() => muxOs.quitProgram(program.id)}
        onMove={handleDragStart}
      />
      {program.component(muxOs)}

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '10px',
          height: '10px',
          cursor: 'se-resize',
        }}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};
