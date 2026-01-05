import './AircraftContent.css';
import React, { useEffect, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Icon } from '../../../ui/icon/Icon';
import { IconName } from '../../../ui/icon/IconName';


export const AircraftContent = ({ scrollPosition$ }: { scrollPosition$: BehaviorSubject<number> }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [scrollStart, setScrollStart] = useState<number | null>(null);
  const assets = require('./assets/meta.json').map((d: any) => ({
    ...d, src: d.src ? require(`${'./assets/' + d.src}?{sizes:[200, 400, 720, 1200, 2000], format: "jpeg"}`) : undefined
  })) as { href: string, src: string }[];

  const handleScroll = (scrollPosition: number) => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const { top, height } = element.getBoundingClientRect();
    const topOffset = height / 2;
    const shouldScroll = top <= topOffset;

    if (shouldScroll && scrollStart === null) {
      setScrollStart(scrollPosition);
    }

    if (shouldScroll && scrollStart !== null) {
      let maskSize = 40;
      const scrolledSinceSticky = scrollPosition - scrollStart;
      const scrollMax = element.scrollWidth - element.clientWidth;
      const speed = scrollMax / height;
      const scrollRatio = Math.min(1, Math.max(0, scrolledSinceSticky / scrollMax * speed));
      const scrollLeft = scrollRatio * scrollMax;
      const shrinkDistance = maskSize * 2.5;
      const shrinkStart = scrollMax - shrinkDistance;

      if (shrinkStart < scrollLeft) {
        maskSize = Math.max(0, (scrollMax - scrollLeft) / shrinkDistance * maskSize);
      }

      requestAnimationFrame(() => {
        element.scrollLeft = scrollLeft;
        element.style.setProperty('--maskSize', `${maskSize}px`);
      });
    }

    if (!shouldScroll) {
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
      <div className='aircraft-grid'>
        <h2>Ultimate Air- & Spacecraft Collection</h2>
        {assets.map((asset, i: number) => (
          <a className='button aircraft-item' key={i} href={asset.href} target='_blank'>
            <Icon name={IconName.REBRICKABLE} fill='#ffffff' />
            <img src={asset.src} />
          </a>
        ))}
      </div>
    </div>
  );
};
