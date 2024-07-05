import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageEntry, ImageData } from './ImageEntry';
import { Loading } from './Loading';
import { GridEntryData, generateGrid } from './ImageGalleryGridGenerator';

import './ImageGallery.styl';


interface ImageGalleryProps {
  data: ImageData[];
  desiredMinHeight?: number;
  gap?: number;
}

export function ImageGallery({ data, desiredMinHeight = 250, gap = 20 }: ImageGalleryProps) {

  const elementRef = useRef<HTMLDivElement>(null);
  const [gridData, setGridData] = useState<GridEntryData[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const grid = useMemo(() => generateGrid(gridData, desiredMinHeight, size.width, gap, activeImageId), [gridData, desiredMinHeight, size.width, gap, activeImageId]);

  useEffect(() => {
    (async () => {
      const gd = await Promise.all(
        data.map((d) => {
          return new Promise<GridEntryData>((resolve) => {
            const img = new Image();
            img.src = d.srcSet.split(' ')[0]; // use smallest, asuming it is the first
            img.onload = () => {
              resolve({
                ...d,
                width: img.width,
                height: img.height,
                x: 0,
                y: 0,
              });
            };
          });
        })
      );
      setTimeout(() => setLoaded(true), 1000) // TODO: improve the timeout
      setGridData(gd);
    })();
  }, [data]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
    };
  }, []);

  const singleImageMode = activeImageId !== null;

  return (
    <div className={`image-gallery ${singleImageMode ? 'single-image-mode' : ''}`} ref={elementRef}>
      <div
        className='image-grid'
        style={{ height: grid.height }}
      >
        {loaded ? grid.data.map((d) => {
          const inactiveTargetScale = 0.9;
          const gridScale = Math.max(d.width / size.width, d.height / size.height);
          const isActive = activeImageId === d.src;
          const scale = singleImageMode ?
            (isActive ? 1 : inactiveTargetScale * gridScale) :
            gridScale;
          const translate = singleImageMode ?
            (isActive ? { x: (size.width - d.width / gridScale) * 0.5, y: elementRef.current?.scrollTop ?? 0, z: 0 } : { x: d.x + d.width * 0.5 * (1 - inactiveTargetScale), y: d.y + d.height * 0.5 * (1 - inactiveTargetScale), z: -1 }) :
            { x: d.x, y: d.y, z: 0 };
          return <div
            className={`image-grid-entry ${isActive ? 'active' : ''}`}
            key={d.src}
            style={{ transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px) scale(${scale})` }}
          >
            <ImageEntry
              data={{ ...d, width: d.width / gridScale, height: d.height / gridScale }}
              active={d.active}
              setActive={(e) => {
                if (e === null) {
                  setActiveImageId(null);
                } else {
                  const i = gridData.findIndex((gd) => gd.src === d.src);
                  setActiveImageId(gridData[(i + e + gridData.length) % gridData.length].src);
                }
              }} />
          </div>
        })
          : <Loading />}
      </div>
    </div>
  );
};
