import './DragSwipeIndicator.css';
import React from 'react';
import { Icon } from '../icon/Icon';
import { IconName } from '../icon/IconName';

export const DragSwipeIndicator = ({ overflow, position, size = 40, margin = 60 }: {
  overflow: { top: number, right: number, bottom: number, left: number },
  position: { x: number, y: number },
  size?: number,
  margin?: number,
}) => {
  const maxOverflow = Math.max(...Object.values(overflow));
  const left = `clamp(${margin}px, calc(50% + ${position.x}px), calc(100% - ${margin}px))`;
  const top = `clamp(${margin}px, calc(50% + ${position.y}px), calc(100% - ${margin}px))`;

  return (
    <div className='drag-swipe-indicator'>
      <div
        className='drag-swipe-indicator-item'
        style={{ opacity: maxOverflow === 1 ? 1 : maxOverflow / 2, left, top, width: size, height: size }}
      >
        <Icon name={IconName.BRING_TO_BACK} />
      </div>
    </div>
  );
};
