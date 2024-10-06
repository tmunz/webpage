export interface SelectedDragBoardItem {
  id: string;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
  isDragging: boolean;
  isResizing: boolean;
}