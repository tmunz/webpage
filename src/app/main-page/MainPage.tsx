import './MainPage.css';
import React, { useRef } from 'react';
import { ProjectCarousel } from './ProjectCarousel';
import { MainPageButton } from './MainPageButton';

interface MainPageProps {
  onToggle: () => void;
  revealed: boolean;
}

export function MainPage({ onToggle, revealed }: MainPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLSpanElement>(null);

  return (
    <section className="main-page" aria-label="Tobias Munzert">
      <header className="main-header">
        <span ref={identityRef} className="main-header-identity">
          <img src={require('./assets/tmunz.png')} alt="tmunz logo" width={28} height={28} />
          <span>Tobias Munzert</span>
        </span>
      </header>
      <div ref={heroRef} className="main-page-hero" aria-hidden={revealed} {...(revealed ? { inert: '' } : {})}>
        <div className="main-page-copy">
          <p className="main-page-eyebrow">Code / Photography / Design</p>
          <h1>Ideas into<br /><span>things.</span></h1>
          <p className="main-page-description">
            I’m Tobias, a software engineer with an interest in art, interaction, and the way things work.
            This is a collection of what I build, make, and see.
          </p>
        </div>
        <ProjectCarousel visible={!revealed} />
      </div>
      <MainPageButton revealed={revealed} onToggle={onToggle} heroRef={heroRef} identityRef={identityRef} />
    </section>
  );
}
