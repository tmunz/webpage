import { ImageData } from './ImageEntry';

export interface GridEntryData extends ImageData {
  width: number;
  height: number;
  x?: number;
  y?: number;
  active?: boolean;
}

export interface Grid {
  data: GridEntryData[];
  height: number;
}

interface GridRow {
  width: number;
  gap: number;
  data: GridEntryData[];
}

export function generateGrid(data: GridEntryData[], desiredMinHeight: number, gridWidth: number, gap: number, active: string | null): Grid {

  const gridRows: GridRow[] = [{ width: -gap, gap, data: [] }];

  data.forEach((d) => {
    const aspectRatio = d.width / d.height;
    const desiredImageWidth = desiredMinHeight * aspectRatio;
    const isActive = active === d.src;

    if (gridWidth < gridRows[gridRows.length - 1].width + desiredImageWidth + gap) {
      gridRows.push({ width: -gap, gap, data: [] });
    }

    const currentRow = gridRows[gridRows.length - 1];
    gridRows[gridRows.length - 1] = {
      ...currentRow,
      width: currentRow.width + desiredImageWidth + gap,
      data: [...currentRow.data, { ...d, height: desiredMinHeight, width: desiredImageWidth, active: isActive }]
    };

  });

  return convertGridRowsToGrid(gridRows, gap, gridWidth, desiredMinHeight);
}

function convertGridRowsToGrid(gridRows: GridRow[], gap: number, gridWidth: number, desiredMinHeight: number): Grid {
  const grid: Grid = { data: [], height: 0 };

  gridRows.forEach(row => {
    const gapSpace = (row.data.length - 1) * gap;
    const multiplier = (gridWidth - gapSpace) / (row.width - gapSpace);
    const height = multiplier * desiredMinHeight;
    let baseX = 0;
    row.data.forEach(d => {
      const width = d.width * multiplier;
      grid.data.push({ ...d, x: baseX, y: grid.height, width, height });
      baseX += width + gap;
    });
    grid.height = grid.height + height + gap;
  });

  return { ...grid, height: grid.height - gap };
}