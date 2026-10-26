import './Carousel.css';
import React, { Children, ReactNode, useRef, useState } from 'react';
import { CarouselIndicator } from './CarouselIndicator';

interface CarouselProps {
  children: ReactNode;
  label: string;
  title?: string;
  itemLabel?: string;
  slideLabels?: string[];
  viewportLabel?: string;
  className?: string;
}

export function Carousel({ children, label, title, itemLabel = 'slide', slideLabels = [], viewportLabel, className = '' }: CarouselProps) {
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const total = slides.length;
  const activeIndex = Math.min(index, total - 1);
  const step = (direction: number) => setIndex(current => (Math.min(current, total - 1) + direction + total) % total);

  if (total === 0) return null;

  return (
    <section className={`carousel ${className}`} aria-label={label} aria-roledescription="carousel">
      <div className="carousel-viewport" tabIndex={0} aria-label={viewportLabel ?? `${label}; use left and right arrow keys`}
        onKeyDown={event => {
          if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            step(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}
        onTouchStart={event => {
          const touch = event.touches[0];
          touchStart.current = touch ? { x: touch.clientX, y: touch.clientY ?? 0 } : null;
          swiped.current = false;
        }}
        onTouchEnd={event => {
          const end = event.changedTouches[0];
          if (touchStart.current && end) {
            const dx = end.clientX - touchStart.current.x;
            const dy = (end.clientY ?? 0) - touchStart.current.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
              step(dx < 0 ? 1 : -1);
              swiped.current = true;
            }
          }
          touchStart.current = null;
        }}
        onTouchCancel={() => { touchStart.current = null; swiped.current = false; }}
        onClickCapture={event => {
          if (swiped.current) {
            event.preventDefault();
            event.stopPropagation();
            swiped.current = false;
          }
        }}>
        <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {slides.map((slide, slideIndex) => (
            <div key={React.isValidElement(slide) ? slide.key ?? slideIndex : slideIndex}
              className="carousel-slide" role="group" aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${total}`} aria-hidden={slideIndex !== activeIndex}
              {...(slideIndex !== activeIndex ? { inert: '' } : {})}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      <CarouselIndicator total={total} activeIndex={activeIndex} onSelect={setIndex}
        label={`Choose ${itemLabel}`} labels={slides.map((_, slideIndex) => `Show ${slideLabels[slideIndex] ?? `${itemLabel} ${slideIndex + 1}`}`)} />
    </section>
  );
}
