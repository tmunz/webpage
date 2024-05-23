import React, { useEffect, useRef, useState } from 'react';
import { ImageEntry, ImageData } from './ImageEntry';

import './ImageGallery.styl';


interface ImageGalleryProps {
  data: ImageData[];
  desiredMinHeight?: number;
}

interface GridEntryData extends ImageData {
  width: number;
  height: number;
  spaceUsage?: number;
  active?: boolean;
}

interface Grid {
  data: GridEntryData[][];
  active: { row: number, column: number } | null;
}

export function ImageGallery({ data, desiredMinHeight = 200 }: ImageGalleryProps) {

  const elementRef = useRef<HTMLDivElement>(null);
  const [gridData, setGridData] = useState<GridEntryData[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setGridData(await Promise.all(
        data.map((d) => {
          return new Promise<GridEntryData>((resolve) => {
            const img = new Image();
            img.src = d.srcSet.split(' ')[0]; // use smallest, asuming it is the first
            img.onload = () => {
              resolve({
                ...d,
                width: img.width,
                height: img.height,
              });
            };
          });
        })
      ));
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

  const grid = generateGrid(gridData, desiredMinHeight, size, active);

  return (
    <div className="image-gallery">
      <div className={`image-grid ${grid.active ? 'single-image-mode' : ''}`} ref={elementRef}>
        {grid.data.map((row, i) => (
          <div
            className="image-row"
            key={i}
            style={{ gridTemplateColumns: row.map((image, j) => `${grid.active ? (grid.active.row === i && grid.active.column === j ? 1 : 0) : image.spaceUsage}fr`).join(' ') }}
          >
            {row.map((d) => <ImageEntry key={d.src} data={d} active={d.active} onClick={() => setActive(active ? null : d.src)} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

function generateGrid(data: GridEntryData[], desiredMinHeight: number, size: { width: number, height: number }, active: string | null): Grid {
  const grid: Grid = { data: [], active: null };
  let currentRow: GridEntryData[] = [];
  let currentRowWidth = 0;

  const addRowToGrid = (row: GridEntryData[]) => {
    if (row.length === 1) {
      row[0].spaceUsage = 1;
    }
    if (0 < currentRow.length) {
      grid.data.push(row);
    }
  }

  data.forEach((d) => {
    const aspectRatio = d.width / d.height;
    const desiredImageWidth = desiredMinHeight * aspectRatio;
    currentRowWidth += desiredImageWidth;
    const isActive = active === d.src;

    if (size.width < currentRowWidth) {
      addRowToGrid(currentRow);
      currentRowWidth = desiredImageWidth;
      currentRow = [];
    }

    if (isActive) {
      grid.active = { row: grid.data.length, column: currentRow.length };
    }
    const gridEntry = { ...d, spaceUsage: aspectRatio, active: isActive };
    currentRow.push(gridEntry);
  });

  addRowToGrid(currentRow);

  return grid;
}
