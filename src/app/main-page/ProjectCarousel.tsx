import './ProjectCarousel.css';
import React, { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { featuredProjects } from './FeaturedProjects';
import { PROJECT_DURATION, useProjectPlayback } from './useProjectPlayback';

const ProjectCarouselScene = lazy(() => import('./ProjectCarouselScene'));

class SceneBoundary extends Component<{ children: React.ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ProjectCarousel({ visible = true }: { visible?: boolean }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const clickedProject = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const openProject = useCallback((projectIndex: number) => {
    window.open(featuredProjects[projectIndex].url, '_blank', 'noopener,noreferrer');
  }, []);
  const project = featuredProjects[index];
  const step = useCallback((direction: number) => setIndex(current => (current + direction + featuredProjects.length) % featuredProjects.length), []);
  const advance = useCallback(() => step(1), [step]);
  const running = visible && pageVisible && inView;
  const autoplay = running && ready && !paused && !reducedMotion && !hovered && !focused && !dragging;
  useProjectPlayback(index, autoplay, advance);
  const sceneReady = useCallback(() => setReady(true), []);
  const sceneFailed = useCallback(() => { setReady(false); setWebgl(false); }, []);

  useEffect(() => {
    if (!stageRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(query.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setWebgl(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setWebgl(false); }
    return () => {
      query.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return (
    <section className="project-carousel" aria-label="Selected projects" aria-roledescription="carousel"
      style={{ '--project-accent': project.color, '--project-duration': `${PROJECT_DURATION}ms` } as React.CSSProperties}
      onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      <div className="project-carousel-heading">
        <span>Selected Projects</span>
        <div className="project-playback">
          <span className="project-edition">A collection in motion</span>
          {ready && !reducedMotion && <button type="button" className="project-playback-button"
            aria-label={paused ? 'Play project animation' : 'Pause project animation'} aria-pressed={paused}
            onClick={() => setPaused(current => !current)}>
            <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>{paused ? 'Play' : 'Pause'}
          </button>}
        </div>
      </div>
      <div ref={stageRef} className={`project-stage${ready ? ' project-stage--ready' : ''}`} tabIndex={0}
        role="slider" aria-label="Selected project. Use left and right arrow keys or swipe to explore. Press Enter to open."
        aria-valuemin={1} aria-valuemax={featuredProjects.length} aria-valuenow={index + 1} aria-valuetext={project.name}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            openProject(index);
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            step(event.key === 'ArrowLeft' ? -1 : 1);
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            setIndex(event.key === 'Home' ? 0 : featuredProjects.length - 1);
          }
        }}
        onPointerDownCapture={() => { clickedProject.current = null; suppressClick.current = false; }}
        onClick={() => {
          if (!suppressClick.current && clickedProject.current !== null) openProject(clickedProject.current);
          clickedProject.current = null;
        }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          setDragging(true);
          pointerStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={event => {
          const start = pointerStart.current;
          if (start) {
            const dx = event.clientX - start.x;
            suppressClick.current = Math.hypot(dx, event.clientY - start.y) > 8;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) step(dx < 0 ? 1 : -1);
          }
          pointerStart.current = null;
          setDragging(false);
        }}
        onPointerCancel={() => { pointerStart.current = null; suppressClick.current = true; setDragging(false); }}
        onLostPointerCapture={() => { pointerStart.current = null; setDragging(false); }}>
        <div className="project-stage-grid" aria-hidden="true" />
        <div className="project-stage-fallback" aria-hidden="true"
          onPointerDown={() => { if (!ready) clickedProject.current = index; }}
          onClick={event => {
            event.stopPropagation();
            if (!ready && !suppressClick.current) openProject(index);
          }}>
          <img src={project.image} alt="" draggable={false} />
        </div>
        {webgl && <div className="project-stage-canvas" aria-hidden="true">
          <SceneBoundary onError={sceneFailed}>
            <Suspense fallback={null}>
              <ProjectCarouselScene index={index} reducedMotion={reducedMotion}
                running={running} paused={paused || dragging} onReady={sceneReady}
                onProjectPointerDown={projectIndex => { clickedProject.current = projectIndex; }} />
            </Suspense>
          </SceneBoundary>
        </div>}
        <span className="project-stage-number" aria-hidden="true">0{index + 1}</span>
      </div>
      <div className="project-information">
        <div className="project-copy" aria-live={autoplay ? 'off' : 'polite'} aria-atomic="true">
          <span className="project-type">{project.type}</span>
          <h2>{project.name}</h2>
          <p className="project-description">{project.description}</p>
          <p className="project-detail">{project.detail}</p>
        </div>
        <div className="project-links">
          <a className="project-link" href={project.url}
            target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} live project`}>
            Open project <span aria-hidden="true">↗</span>
          </a>
          <a className="project-link" href={`https://github.com/tmunz/${project.repository}`}
            target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.name} on GitHub`}>
            Code / GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        {ready && !reducedMotion && <div className="project-timeline" aria-hidden="true">
          <span key={index} style={{ animationPlayState: autoplay ? 'running' : 'paused' }} />
        </div>}
      </div>
      <div className="project-navigation">
        <div className="project-selection" role="group" aria-label="Choose a project">
          {featuredProjects.map((item, itemIndex) => (
            <button key={item.repository} type="button" aria-pressed={itemIndex === index}
              onClick={() => setIndex(itemIndex)} aria-label={`Show ${item.name}`}>
              <span className="project-selection-number">0{itemIndex + 1}</span><span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="project-arrows">
          <button type="button" onClick={() => step(-1)} aria-label="Previous project">←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next project">→</button>
        </div>
      </div>
    </section>
  );
}
