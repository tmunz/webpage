import './CarouselIndicator.css';
import React, { useId } from 'react';

interface CarouselIndicatorProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  radius?: number;
  gap?: number;
  label?: string;
  labels?: string[];
}

export const CarouselIndicator = ({ total, activeIndex, onSelect, radius = 10, gap = 4, label = 'Choose slide', labels = [] }: CarouselIndicatorProps) => {
  const filterId = `carousel-blob-${useId().replace(/:/g, '')}`;

  return (
    <div className='carousel-indicator' role="group" aria-label={label}>
      <div className='carousel-dots'
        style={{ gap, filter: `url("#${filterId}")` }}
      >
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            className='dot'
            aria-label={labels[index] ?? `Show slide ${index + 1}`}
            aria-pressed={index === activeIndex}
            style={{ width: radius * 2, height: radius * 2 }}
            onClick={() => onSelect(index)}
          />
        ))}
        {total > 0 && <div
          className='dot active-dot'
          aria-hidden="true"
          style={{ left: -gap / 2 + activeIndex * (radius * 2 + gap), top: -gap / 2, width: radius * 2 + gap, height: radius * 2 + gap }}
        />}
        <svg xmlns='http://www.w3.org/2000/svg' version='1.1' style={{ display: 'none' }}>
          <defs>
            <filter id={filterId}>
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
