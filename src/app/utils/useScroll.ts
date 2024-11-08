import { useEffect, RefObject, useRef } from 'react';
import { BehaviorSubject } from 'rxjs';

export const useScroll = (elementRef: RefObject<HTMLElement>) => {
  const { current: scroll$ } = useRef<BehaviorSubject<number>>(new BehaviorSubject(0));

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollPosition = element.scrollTop;
      const totalScrollHeight = element.scrollHeight - element.clientHeight;
      const offset = (scrollPosition / totalScrollHeight);

      scroll$.next(offset);
    };

    element.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef]);

  return scroll$;
};
