import { RefObject, useEffect, useRef, useState } from 'react';

export const useDimension = (elementRef: RefObject<HTMLElement>, animationThreshold = 0) => {
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentDimensionRef = useRef<{ width: number; height: number } | null>(null);
  const [dimension, setDimension] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (elementRef.current) {
        const width = Math.floor(elementRef.current.offsetWidth);
        const height = Math.floor(elementRef.current.offsetHeight);
        const current = currentDimensionRef.current;

        if (current === null || current.width !== width || current.height !== height) {
          if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
          }
          resizeTimeoutRef.current = setTimeout(() => {
            const newDimension = { width, height };
            currentDimensionRef.current = newDimension;
            setDimension(newDimension);
          }, animationThreshold);
        }
      }
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          updateDimensions();
        }
      }
    });

    const handleWindowResize = () => {
      updateDimensions();
    };

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
      window.removeEventListener('resize', handleWindowResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [elementRef.current, animationThreshold]);

  useEffect(() => {
    if (elementRef.current !== null) {
      const width = Math.floor(elementRef.current.offsetWidth);
      const height = Math.floor(elementRef.current.offsetHeight);
      const newDimension = { width, height };
      currentDimensionRef.current = newDimension;
      setDimension(newDimension);
    }
  }, []);

  return dimension;
};
