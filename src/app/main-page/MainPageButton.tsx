import './MainPageButton.css';
import React, { RefObject, useLayoutEffect, useState } from 'react';
import { Icon } from '../ui/icon/Icon';
import { IconName } from '../ui/icon/IconName';

interface MainPageButtonProps {
  revealed: boolean;
  onToggle: () => void;
  heroRef: RefObject<HTMLElement>;
  identityRef: RefObject<HTMLElement>;
}

export function MainPageButton({ revealed, onToggle, heroRef, identityRef }: MainPageButtonProps) {
  const [geometry, setGeometry] = useState({ top: 0, identityWidth: 0 });

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const identity = identityRef.current;
    if (!hero || !identity) return;
    const updatePosition = () => setGeometry({
      top: hero.getBoundingClientRect().bottom + 8,
      identityWidth: identity.getBoundingClientRect().width,
    });
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(hero);
    observer.observe(identity);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [heroRef, identityRef]);

  return (
    <button className={`main-page-toggle${revealed ? ' main-page-toggle--revealed' : ''}`} type="button"
      style={{
        '--toggle-start-top': `${geometry.top}px`,
        '--main-header-identity-width': `${geometry.identityWidth}px`,
      } as React.CSSProperties}
      aria-label={revealed ? 'Return to main page' : 'Explore the five categories'}
      aria-expanded={revealed} onClick={onToggle}>
      <span className="main-page-toggle-circle" aria-hidden="true">
        <span className="main-page-toggle-icon">
          <Icon name={IconName.NEXT} fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
