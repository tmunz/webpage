import './PaperFolding.styl';

import React, { useRef, useState } from 'react';
import { PaperEffect } from './PaperEffect';
import { useDimension } from '../utils/Dimension';


export function PaperFolding({ children, onUnfold, onInfold, className }: { children?: React.ReactNode, onUnfold?: () => void, onInfold?: () => void, className?: string }) {

  const [initial, setInitial] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentDimension = useDimension(contentRef);

  const setPaper = (status = true) => {
    setInitial(false);
    setOpen(status);
    if (status) {
      onUnfold?.();
    } else {
      onInfold?.();
    }
  };

  return <div
    className={`paper-folding ${className ?? ''} ${open ? 'open' : 'closed'} ${initial ? 'initial' : ''}`}
    style={{ width: (contentDimension?.width ?? 0) * (open ? 1 : 0.5), height: (contentDimension?.height ?? 0) * (open ? 1 : 0.5) }}
  >
    <div
      className='paper-folding-paper'
      style={{ width: (contentDimension?.width ?? 0), height: (contentDimension?.height ?? 0) }}
    >
      {['tl', 'tr', 'bl', 'br'].map((id) =>
        <PaperEffect key={id} seed={id}>
          <div className={`paper-part paper-part-${id}`}>
            <div className='paper-part-frontside'>
              {id === 'br' && <PaperEffect><button className="paper-folding-infold" onClick={() => setPaper(false)}>✖</button></PaperEffect>}
            </div>
            <div className='paper-part-backside'></div>
            {
              // use here instead of paper-part-backside because filter disable rotation
              id === 'tr' && <button className="paper-folding-unfold" onClick={() => setPaper()} />
            }
          </div>
        </PaperEffect>
      )}
    </div>
    <div className='paper-folding-content' ref={contentRef}>
      {children}
    </div>
  </div >;
}