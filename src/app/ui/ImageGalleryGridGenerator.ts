import { ImageData } from './ImageEntry';

interface GridEntryData_ {
  x?: number;
  y?: number;
}

export type GridEntryImage = GridEntryData_ & ImageData & {
  type: 'image', id: string, active: boolean, index: [number, number],
  width: number, height: number,
};
export type GridEntryTitle = GridEntryData_ & { type: 'title', title: string };
export type GridEntryData = GridEntryImage | GridEntryTitle;

export interface Grid {
  data: GridEntryData[];
  height: number;
}

interface GridImageRow {
  type: 'image';
  width: number;
  gap: number;
  data: GridEntryImage[];
  completed: boolean;
}
interface GridRowTitle {
  type: 'title';
  title: string;
}
type GridRow = GridImageRow | GridRowTitle;

export function generateGrid(sections: { title: string, data: GridEntryImage[] }[], desiredMinHeight: number, gridWidth: number, gap: number, active?: [number, number] | null): Grid {

  const width = gridWidth - gap;
  const gridRows: GridRow[] = [];
  sections.forEach((section, sectionIndex) => {
    gridRows.push({ type: 'title', title: section.title });
    gridRows.push({ type: 'image', width: -gap, gap, data: [], completed: false });
    section.data.forEach((d, i) => {
      const aspectRatio = d.width / d.height;
      const desiredImageWidth = desiredMinHeight * aspectRatio;
      const isActive = active ? (sectionIndex === active[0] && i === active[1]) : false;

      let currentRow = gridRows[gridRows.length - 1] as GridImageRow;

      if (width < currentRow.width + desiredImageWidth + gap) {
        currentRow.completed = true;
        gridRows.push({ type: 'image', width: -gap, gap, data: [], completed: false });
      }

      currentRow = gridRows[gridRows.length - 1] as GridImageRow;

      gridRows[gridRows.length - 1] = {
        ...currentRow,
        width: currentRow.width + desiredImageWidth + gap,
        data: [...currentRow.data, { ...d, height: desiredMinHeight, width: desiredImageWidth, active: isActive, index: [sectionIndex, i] }]
      };
    });
  });

  return convertGridRowsToGrid(gridRows, gap, width, desiredMinHeight);
}

function convertGridRowsToGrid(gridRows: GridRow[], gap: number, gridWidth: number, desiredMinHeight: number): Grid {
  const grid: Grid = { data: [], height: 0 };

  gridRows.forEach(row => {
    if (row.type === 'title') {
      grid.data.push({ ...row, x: gap, y: grid.height });
      grid.height += 30 + gap;
    } else if (row.type === 'image') {
      const gapSpace = (row.data.length - 1) * gap;
      const multiplier = row.completed ? (gridWidth - gapSpace) / (row.width - gapSpace) : 1;
      const height = multiplier * desiredMinHeight;
      let baseX = gap;
      row.data.forEach((d: GridEntryImage) => {
        const width = d.width * multiplier;
        grid.data.push({ ...d, x: baseX, y: grid.height, width, height });
        baseX += width + gap;
      });
      grid.height += height + gap;
    }
  });

  return { ...grid, height: grid.height };
}