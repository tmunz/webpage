import './CarouselIndicator.css';
import React from 'react';

interface CarouselIndicatorProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  radius?: number;
  gap?: number;
}

export const CarouselIndicator = ({ total, activeIndex, onSelect, radius = 10, gap = 4 }: CarouselIndicatorProps) => {

  return (
    <div className='carousel-indicator'>
      <div className='carousel-dots'
        style={{ gap }}
      >
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className='dot'
            style={{ width: radius * 2, height: radius * 2 }}
            onClick={() => onSelect(index)}
          />
        ))}
        {total > 0 && <div
          className='dot active-dot'
          style={{ left: -gap / 2 + activeIndex * (radius * 2 + gap), top: -gap / 2, width: radius * 2 + gap, height: radius * 2 + gap }}
        />}
        <svg xmlns='http://www.w3.org/2000/svg' version='1.1' style={{ display: 'none' }}>
          <defs>
            <filter id='blob'>
              <feGaussianBlur in='SourceGraphic' result='blur' stdDeviation='5' />
              <feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8' result='blob' />
              <feGaussianBlur in='blob' stdDeviation='3' result='shadow' />
              <feColorMatrix in='shadow' mode='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2' result='shadow' />
              <feOffset in='shadow' dx='1' dy='1' result='shadow' />
              <feComposite in2='shadow' in='blob' result='blob' />
              <feComposite in2='blob' in='SourceGraphic' operator='over' result='mix' />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};
