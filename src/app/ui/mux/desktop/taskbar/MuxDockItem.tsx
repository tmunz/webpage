import './MuxDockItem.css';
import React, { useRef } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Pointer } from '../../../../utils/usePointer';
import { useMuxDockItemHoverAnimation } from './useMuxDockItemHoverAnimation';

interface DockItemProps {
  id: string;
  pointer$: BehaviorSubject<Pointer>;
  width?: number;
  onOpen?: () => void;
  children?: React.ReactNode;
}

export function MuxDockItem({ id, pointer$, width, onOpen, children }: DockItemProps) {
  const elementRef = useRef<any>(null);
  const { width: hoverWidth } = useMuxDockItemHoverAnimation(pointer$, elementRef, width);

  return (
    <li className='mux-dock-item' id={id} key={id} style={{ width: hoverWidth }} ref={elementRef}>
      {onOpen ? <button onClick={onOpen}>{children}</button> : children}
    </li>
  );
}
