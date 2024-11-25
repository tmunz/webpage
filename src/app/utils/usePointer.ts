import React, { useEffect, useRef } from 'react';
import { BehaviorSubject } from 'rxjs';

export interface Pointer {
  x: number;
  y: number;
  cx: number; // x in the range [-1, 1]
  cy: number; // y in the range [-1, 1]
  container: { left: number, top: number, width: number, height: number };
}

export const usePointer = (elementRef: React.RefObject<HTMLElement>) => {
  const { current: position$ } = useRef(new BehaviorSubject<Pointer>(
    { x: 0, y: 0, cx: 0, cy: 0, container: { left: 0, top: 0, width: 0, height: 0 } })
  );

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (elementRef.current) {
        const container = elementRef.current.getBoundingClientRect();
        const x = (event instanceof MouseEvent ? event.clientX : event.touches?.[0]?.clientX) - container.left;
        const y = (event instanceof MouseEvent ? event.clientY : event.touches?.[0]?.clientY) - container.top;

        // Calculate pointer position relative to the element’s dimensions in the range [-1, 1]
        const cx = x / container.width * 2 - 1;
        const cy = y / container.height * 2 - 1;

        position$.next({ x, y, cx, cy, container });
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

