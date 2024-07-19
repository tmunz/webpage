import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageEntry, ImageData } from './ImageEntry';
import { GridEntryData, generateGrid } from './ImageGalleryGridGenerator';
import { Icon } from './icon/Icon';
import { IconName } from './icon/IconName';

import './ImageGallery.styl';


interface ImageGalleryProps {
  data: ImageData[];
  desiredMinHeight?: number;
  gap?: number;
  delay?: number;
}

const SCROLLBAR_WIDTH = 12;

export function ImageGallery({ data, desiredMinHeight = 250, gap = 20 }: ImageGalleryProps) {

  const elementRef = useRef<HTMLDivElement>(null);

  const [loadedData, setLoadedData] = useState<GridEntryData[]>(data.map((d) => ({ ...d, width: 2 + Math.random(), height: 2 })));
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [userAction, setUserAction] = useState(false);

  const userActionTimeoutRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const grid = useMemo(() => generateGrid(loadedData, desiredMinHeight, size.width - SCROLLBAR_WIDTH, gap, activeImageId), [loadedData, desiredMinHeight, size.width, gap, activeImageId]);


  const isSingleImageMode = () => {
    return activeImageId !== null;
  }

  const handleUserAction = (e: MouseEvent | KeyboardEvent | TouchEvent) => {
    if (userActionTimeoutRef.current) {
      clearTimeout(userActionTimeoutRef.current);
      userActionTimeoutRef.current = null;
    }
    setUserAction(true);
    if (isSingleImageMode()) {
      userActionTimeoutRef.current = window.setTimeout(() => {
        setUserAction(false);
      }, 2500);

      if (e instanceof KeyboardEvent) {
        if (e.key === 'ArrowRight') {
          setActive(+1);
        } else if (e.key === 'ArrowLeft') {
          setActive(-1);
        } else if (e.key === 'Escape') {
          setActive(null);
        }
      }
    }
  };

  useEffect(() => {
    if (isSingleImageMode()) {
      document.addEventListener('click', handleUserAction);
      document.addEventListener('mousemove', handleUserAction);
      document.addEventListener('keydown', handleUserAction);
      document.addEventListener('touchstart', handleUserAction);

      return () => {
        if (userActionTimeoutRef.current) {
          clearTimeout(userActionTimeoutRef.current);
          userActionTimeoutRef.current = null;
        }
        document.removeEventListener('click', handleUserAction);
        document.removeEventListener('mousemove', handleUserAction);
        document.removeEventListener('keydown', handleUserAction);
        document.removeEventListener('touchstart', handleUserAction);
      };
    }
  }, [activeImageId]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target instanceof HTMLDivElement) {
          const width = Math.floor(entry.target.offsetWidth);
          const height = Math.floor(entry.target.offsetHeight);
          if (size.width !== width || size.height !== height) {
            if (resizeTimeoutRef.current) {
              clearTimeout(resizeTimeoutRef.current);
            }
            resizeTimeoutRef.current = setTimeout(() => {
              setSize({ width, height });
            }, 40);
          }
        }
      }
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, []);

  const setActive = (e: number | null) => {
    if (e === null) {
      setActiveImageId(null);
    } else {
      const i = loadedData.findIndex((gd) => gd.src === activeImageId);
      if (0 <= i) {
        setActiveImageId(loadedData[(i + e + loadedData.length) % loadedData.length].src);
      }
    }
  }

  return (
    <div className={`image-gallery ${isSingleImageMode() ? 'single-image-mode' : ''}`} ref={elementRef}>
      <div
        className='image-grid'
        style={{ height: grid.height }}
      >
        {grid.data.map((d, i) => {
          const inactiveTargetScale = 0.9;
          const gridScale = Math.max(d.width / size.width, d.height / size.height);
          const isActive = activeImageId === d.src;
          const scale = isSingleImageMode() ?
            (isActive ? 1 : inactiveTargetScale * gridScale) :
            gridScale;
          const translate = isSingleImageMode() ?
            (isActive ? { x: (size.width - d.width / gridScale) * 0.5, y: elementRef.current?.scrollTop ?? 0, z: 0 } :
              { x: d.x ?? 0 + d.width * 0.5 * (1 - inactiveTargetScale), y: d.y ?? 0 + d.height * 0.5 * (1 - inactiveTargetScale), z: -1 }) :
            { x: d.x, y: d.y, z: 0 };
          return <div
            className={`image-grid-entry ${isActive ? 'active' : ''}`}
            key={d.src}
            style={{
              transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px) scale(${scale})`,
              minWidth: `${d.width / gridScale}px`, minHeight: `${d.height / gridScale}px`
            }}
          >
            <ImageEntry
              data={{ ...d, width: d.width / gridScale, height: d.height / gridScale }}
              active={d.active}
              delay={2000}
              onLoaded={(w, h) => {
                setLoadedData(arr => {
                  const nextArr = [...arr];
                  nextArr[i] = { ...nextArr[i], width: w, height: h };
                  return nextArr;
                });
              }}
              hideInfo={!isActive || !userAction}
            />
            <button className='open-button' disabled={isSingleImageMode()} onClick={() => setActiveImageId(d.src)}></button>
          </div>
        })}
      </div>
      <div className={`control-buttons ${(!isSingleImageMode() || !userAction) ? 'hide-controls' : ''}`}>
        <button className="prev-button control-button" onClick={() => setActive(-1)}><Icon name={IconName.PREV} /></button>
        <button className="next-button control-button" onClick={() => setActive(null)}><Icon name={IconName.GRID} /></button>
        <button className="next-button control-button" onClick={() => setActive(+1)}><Icon name={IconName.NEXT} /></button>
      </div>
    </div>
  );
};
