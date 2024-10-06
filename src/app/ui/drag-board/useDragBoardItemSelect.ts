import { useCallback, useState } from 'react';
import { SelectedDragBoardItem } from './SelectedDragBoardItem';
import { DragBoardItemState } from './DragBoardItem';


export const useDragBoardItemSelect = (setItemStates: React.Dispatch<React.SetStateAction<Map<string, DragBoardItemState>>>) => {

  const [selectedItem, setSelectedItem] = useState<SelectedDragBoardItem | null>(null);

  const handleSelectItem = useCallback((id: string, e: { clientX: number, clientY: number, rect: DOMRect }) => {
    setItemStates((prevStates) => {
      const maxZ = Math.max(...Array.from(prevStates.values()).map((item) => item.current.z));
      const states = new Map(prevStates);
      const itemState = states.get(id);

      if (itemState) {
        setSelectedItem({
          id,
          offsetX: e.clientX - itemState.current.x,
          offsetY: e.clientY - itemState.current.y,
          width: e.rect.width,
          height: e.rect.height,
          startX: e.clientX,
          startY: e.clientY,
          isDragging: false,
        });

        states.set(id, { ...itemState, current: { ...itemState.current, z: maxZ + 1 } });
      }
      return states;
    });
  }, []);

  const handleScroll = useCallback((delta: number) => {
    setItemStates((prevStates) => {
      const sortedStates = Array.from(prevStates.values()).sort((a, b) => a.current.z - b.current.z);
      const minZ = sortedStates[0]?.current.z;
      const maxZ = sortedStates[sortedStates.length - 1]?.current.z;

      const states = new Map(prevStates);
      if (delta < 0) {
        const minId = sortedStates[0]?.id;
        if (minId) {
          states.set(minId, {
            ...states.get(minId)!,
            current: { ...states.get(minId)!.current, z: maxZ + 1 },
          });
        }
      } else {
        const maxId = sortedStates[sortedStates.length - 1]?.id;
        if (maxId) {
          states.set(maxId, {
            ...states.get(maxId)!,
            current: { ...states.get(maxId)!.current, z: minZ - 1 },
          });
        }
      }

      return states;
    });
  }, []);

  return { selectedItem, setSelectedItem, handleSelectItem, handleScroll };
};
