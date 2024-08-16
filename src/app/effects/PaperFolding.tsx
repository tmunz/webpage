import './PaperFolding.styl';

import React, { useState } from 'react';
import { PaperEffect } from './PaperEffect';


export function PaperFolding({ children, onUnfold, onInfold }: { children?: React.ReactNode, onUnfold?: () => void, onInfold?: () => void }) {

  const [initial, setInitial] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  const setPaper = (status = true) => {
    setInitial(false);
    setOpen(status);
    if (status) {
      onUnfold?.();
    } else {
      onInfold?.();
    }
  };

  return <div className='paper-folding'>
    <div className={`paper ${open ? 'open' : 'closed'} ${initial ? 'initial' : ''}`}>
      {['tl', 'tr', 'bl', 'br'].map((id) =>
        <PaperEffect key={id} seed={id}>
          <div className={`paper-part paper-part-${id}`}>
            <div className='paper-part-frontside'>
              {id === 'br' && <button className="paper-folding-infold" onClick={() => setPaper(false)}>close</button>}
            </div>
            <div className='paper-part-backside'></div>
            {
              // use here instead of paper-part-backside because filter disable rotation
              id === 'tr' && <button className="paper-folding-unfold" onClick={() => setPaper()} />
            }
          </div>
        </PaperEffect>
      )}
      <div className='paper-folding-content'>
        {/* <div style={{ height: '100%', width: '100%', background: 'purple' }}></div> */}
        {children}
      </div>
    </div>
  </div >;
}