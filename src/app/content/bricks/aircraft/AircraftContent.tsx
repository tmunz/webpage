import './AircraftContent.styl';
import React, { useEffect, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';


export const AircraftContent = ({ scrollPosition$ }: { scrollPosition$: BehaviorSubject<number> }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollStart, setScrollStart] = useState<number | null>(null);

  const handleScroll = (scrollPosition: number) => {
    if (!elementRef.current || !scrollElementRef.current) return;

    const element = elementRef.current;
    const { top, height } = element.getBoundingClientRect();
    const isSticky = top <= height / 2;

    if (isSticky && scrollStart === null) {
      setScrollStart(scrollPosition);
    }

    if (isSticky && scrollStart !== null) {
      const scrollElement = scrollElementRef.current;
      const scrolledSinceSticky = scrollPosition - scrollStart;
      const maxScroll = scrollElement.scrollWidth - element.clientWidth;
      const scrollRatio = Math.min(1, Math.max(0, scrolledSinceSticky / maxScroll));

      requestAnimationFrame(() => {
        element.scrollLeft = scrollRatio * maxScroll * 2;
      });
    }

    if (!isSticky) {
      setScrollStart(null);
      element.scrollLeft = 0;
    }
  };

  useEffect(() => {
    const subscription = scrollPosition$?.subscribe({
      next: handleScroll,
    });
    return () => subscription?.unsubscribe();
  }, [scrollPosition$, handleScroll]);

  return (
    <div ref={elementRef} className='aircraft-content bricks-content'>
      <div ref={scrollElementRef} className='aircraft-grid'>
        <h2>Ultimate Air- & Spacecraft Collection</h2>
        {[...Array(3)].map((_, i) => (
          <img key={i} className='aircraft-image' src={require(`./aircraft_${i}.jpg`)} />
        ))}
      </div>
    </div>
  );
};
