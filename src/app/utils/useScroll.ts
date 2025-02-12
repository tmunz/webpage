import { useEffect, RefObject, useRef } from 'react';
import { BehaviorSubject } from 'rxjs';

export const useScroll = (elementRef: RefObject<HTMLElement>) => {
  const { current: scrollPosition$ } = useRef<BehaviorSubject<number>>(new BehaviorSubject(0));
  const { current: scrollNormalized$ } = useRef<BehaviorSubject<number>>(new BehaviorSubject(0));

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollPosition = element.scrollTop;
      const totalScrollHeight = element.scrollHeight - element.clientHeight;
      const relativeScroll = totalScrollHeight > 0 ? scrollPosition / totalScrollHeight : 0;

      scrollPosition$.next(scrollPosition);
      scrollNormalized$.next(relativeScroll);
    };

    element.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef]);

  return [scrollPosition$, scrollNormalized$];
};
