import './Fullscreenable.styl';
import React, { useState, useRef, useEffect } from 'react';

export const Fullscreenable = ({ children, fullscreen = false }: { children: React.ReactNode, fullscreen?: boolean }) => {
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFullscreen) {
      elementRef.current?.requestFullscreen();
    } else {
      document?.exitFullscreen();
    }
  }, [isFullscreen]);

  return (
    <div ref={elementRef} className='fullscreenable'>
      <div className='fullscreenable-button'>
        <button onClick={() => setIsFullscreen(b => !b)}>
          {isFullscreen ? '\u2715' : '\u26F6'}
        </button>
      </div>
      <div className='fullscreenable-content'>
        {children}
      </div>
    </div>
  );
};
