import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageEntry, ImageData } from './ImageEntry';
import { GridEntryImage, generateGrid } from './ImageGalleryGridGenerator';
import { Icon } from './icon/Icon';
import { IconName } from './icon/IconName';

import './ImageGallery.styl';


interface ImageGalleryProps {
  sections: {
    title: string;
    data: ImageData[];
  }[];
  desiredMinHeight?: number;
  gap?: number;
  delay?: number;
}

const SCROLLBAR_WIDTH = 16;

export function ImageGallery({ sections, desiredMinHeight = 250, gap = 20 }: ImageGalleryProps) {

  const elementRef = useRef<HTMLDivElement>(null);

  const [loadedSections, setLoadedSections] = useState<{ title: string, data: GridEntryImage[] }[]>(
    sections.map((section, sectionIndex) => ({
      ...section, data: section.data.map((d, i) =>
        ({ ...d, id: d.src, width: 2 + Math.random(), height: 2, index: [sectionIndex, i], type: 'image', active: false }))
    }))
  );

  const [size, setSize] = useState<{ width: number, height: number } | null>(null);
  const [showImages, setShowImages] = useState(false);
  const [activeImage, setActiveImage] = useState<[number, number] | null>(null);
  const [userAction, setUserAction] = useState(false);

  const userActionTimeoutRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const grid = useMemo(() => size && generateGrid(loadedSections, desiredMinHeight, size.width - SCROLLBAR_WIDTH, gap, activeImage), [loadedSections, desiredMinHeight, size?.width, gap, activeImage]);


  const isSingleImageMode = () => {
    return activeImage !== null;
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
  }, [activeImage]);

  useEffect(() => {
    if (size !== null) {
      setShowImages(true);
    }
  }, [size]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target instanceof HTMLDivElement) {
          const width = Math.floor(entry.target.offsetWidth);
          const height = Math.floor(entry.target.offsetHeight);
          if (size === null || size.width !== width || size.height !== height) {
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

  const setActive = (e: -1 | 0 | 1 | null) => {
    if (e === null) {
      setActiveImage(null);
    } else {
      setActiveImage(state => {
        const currentSectionIndex = state !== null ? state[0] : 0;
        const currentSectionLength = sections[currentSectionIndex].data.length;
        const currentImageIndex = state !== null ? state[1] : 0;
        const imageIndex = currentImageIndex + e;
        if (imageIndex < 0) {
          return [currentSectionIndex - 1, sections[currentSectionIndex - 1].data.length - 1];
        } else if (currentSectionLength <= imageIndex) {
          return [currentSectionIndex + 1, 0];
        } else {
          return [currentSectionIndex, imageIndex];
        }
      });
    }
  }

  return (
    <div className={`image-gallery ${isSingleImageMode() ? 'single-image-mode' : ''}`} ref={elementRef}>
      {size !== null && grid !== null &&
        <><div
          className='image-grid'
          style={{ height: grid.height }}
        >
          {grid.data.map((d, i) => {
            if (d.type === 'title') {
              const translate = { x: d.x, y: d.y, z: 0 };
              return <div
                key={`section-${i}`}
                className='image-grid-title'
                style={{
                  transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px)`
                }}
              >
                <h2>{d.title}</h2>
              </div>
            } else {
              const inactiveTargetScale = 0.9;
              const gridScale = Math.max(d.width / size.width, d.height / size.height);
              const scale = isSingleImageMode() ?
                (d.active ? 1 : inactiveTargetScale * gridScale) :
                gridScale;
              const translate = isSingleImageMode() ?
                (d.active ? { x: (size.width - d.width / gridScale) * 0.5, y: elementRef.current?.scrollTop ?? 0, z: 0 } :
                  { x: d.x ?? 0 + d.width * 0.5 * (1 - inactiveTargetScale), y: d.y ?? 0 + d.height * 0.5 * (1 - inactiveTargetScale), z: -1 }) :
                { x: d.x, y: d.y, z: 0 };
              return <div
                className={`image-grid-entry ${d.active ? 'active' : ''} ${showImages ? 'show' : ''}`}
                key={d.id}
                style={{
                  transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px) scale(${scale})`,
                  minWidth: `${d.width / gridScale}px`, minHeight: `${d.height / gridScale}px`
                }}
              >
                <ImageEntry
                  data={{ ...d, width: d.width / gridScale, height: d.height / gridScale }}
                  active={d.active}
                  delay={500 + Math.random() * 1500}
                  onLoaded={(width, height) => {
                    setLoadedSections(loadedSections => {
                      const nextSections = [...loadedSections];
                      const nextSection = [...nextSections[d.index[0]].data];
                      nextSection[d.index[1]] = { ...nextSection[d.index[1]], width, height };
                      nextSections[d.index[0]] = { ...nextSections[d.index[0]], data: nextSection };
                      return nextSections;
                    });
                  }}
                  hideInfo={!d.active || !userAction}
                />
                <button className='open-button' disabled={isSingleImageMode()} onClick={() => setActiveImage(d.index)}></button>
              </div>
            }
          })}
        </div>
          <div className={`control-buttons ${(!isSingleImageMode() || !userAction) ? 'hide-controls' : ''}`}>
            <button className="prev-button control-button" onClick={() => setActive(-1)}><Icon name={IconName.PREV} /></button>
            <button className="next-button control-button" onClick={() => setActive(null)}><Icon name={IconName.GRID} /></button>
            <button className="next-button control-button" onClick={() => setActive(+1)}><Icon name={IconName.NEXT} /></button>
          </div>
        </>
      }
    </div >
  );
};
