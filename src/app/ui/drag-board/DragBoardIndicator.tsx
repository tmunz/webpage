import React from 'react';
import { CarouselIndicator } from '../CarouselIndicator';

export const DragBoardIndicator = ({ sortedItems, onSelect }: {
  sortedItems: { id: string, zIndex: number }[],
  onSelect: (id: string) => void
}) => {

  const maxZ = Math.max(...sortedItems.map(item => item.zIndex))

  return <CarouselIndicator
    total={sortedItems.length}
    activeIndex={sortedItems.findIndex(item => item.zIndex === maxZ)}
    onSelect={index => { sortedItems[index] && onSelect(sortedItems[index].id) }}
  />;
}