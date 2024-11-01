import { useState, useEffect, RefObject } from 'react';

export const useScroll = (elementRef: RefObject<HTMLElement>) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollPosition = element.scrollTop;
      const totalScrollHeight = element.scrollHeight - element.clientHeight;
      const offset = (scrollPosition / totalScrollHeight);

      setOffset(offset);
    };

    element.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef]);

  return offset;
}