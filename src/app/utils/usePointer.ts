import React, { useEffect, useRef } from 'react';
import { BehaviorSubject } from 'rxjs';

export const usePointer = (elementRef: React.RefObject<HTMLElement>) => {
  const { current: position$ } = useRef(new BehaviorSubject<{ x: number, y: number }>({ x: 0, y: 0 }));

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const px = event instanceof MouseEvent ? event.clientX : event.touches?.[0]?.clientX;
        const py = event instanceof MouseEvent ? event.clientY : event.touches?.[0]?.clientY;

        // Calculate pointer position relative to the element’s dimensions in the range [-1, 1]
        const x = px / rect.width * 2 - 1;
        const y = py / rect.height * 2 - 1;

        position$.next({ x, y });
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousemove', handlePointerMove);
      element.addEventListener('touchmove', handlePointerMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handlePointerMove);
        element.removeEventListener('touchmove', handlePointerMove);
      }
    };
  }, [elementRef]);

  return position$;
}

