import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Pointer } from '../../../../utils/usePointer';

export const useMuxDockItemHoverAnimation = (
  pointer$: BehaviorSubject<Pointer>,
  elementRef: React.RefObject<HTMLElement>,
  baseSize: number = 40,
  magnitude: number = 1.5,
  distanceThreshold = 80,
) => {
  const [width, setWidth] = useState(baseSize);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateWidth = () => {
      if (!elementRef.current) {
        setWidth(baseSize);
        return;
      }

      const { x, y, container } = pointer$.getValue();
      const rect = elementRef.current.getBoundingClientRect();
      const { centerX, centerY } = {
        centerX: Math.round(rect.left + rect.width / 2 - container.left),
        centerY: Math.round(rect.top + rect.height / 2 - container.top),
      };
      const distanceX = Math.abs(x - centerX);
      const distanceY = Math.max(-(y - centerY), 0);
      const distance = (distanceX + distanceY) / 2; // simplified distance calculation
      const newWidth = baseSize * (1 + (magnitude - 1) * Math.max(0, (distanceThreshold - distance)) / distanceThreshold);
      setWidth(newWidth);

      animationFrameId = requestAnimationFrame(updateWidth);
    };

    animationFrameId = requestAnimationFrame(updateWidth);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [pointer$, elementRef, baseSize, magnitude, distanceThreshold]);

  return { width };
};