import './Frame.css';
import React, { MouseEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FrameCloseButton from './ui/FrameCloseButton';
import { PerspectiveImage } from './effects/PerspectiveImage';
import { IconName } from './ui/icon/IconName';


export interface FrameProps {
  id: string;
  title: string;
  icon: IconName;
  content: ReactNode;
  hint?: ReactNode;
  imgSrc: string;
  depthImgSrc?: string;
  color?: string;
  onClick?: () => void;
  activeId?: string | null;
  animate?: boolean;
  effectValue?: number;
  style?: React.CSSProperties;
}

export const Frame = ({ id, title, content, hint, imgSrc, depthImgSrc, onClick, activeId, animate, effectValue = 1, color, style }: FrameProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<{ x: number, y: number } | null>(null);

  const [parallaxPosition, setParallaxPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [showPerspectiveImage, setShowPerspectiveImage] = useState(false);

  const active = activeId === id;
  const parallax = !activeId;

  useEffect(() => {
    setShowPerspectiveImage(false);
    if (depthImgSrc && parallax) {
      const timeoutId = setTimeout(() => setShowPerspectiveImage(true), 800);
      return () => clearTimeout(timeoutId);
    }
  }, [depthImgSrc, parallax]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const setParallaxPositionFromEvent = useCallback((event: MouseEvent<unknown>): void => {
    if (parallax && (!depthImgSrc || showPerspectiveImage) && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      pendingPositionRef.current = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setParallaxPosition(pendingPositionRef.current!);
        rafRef.current = null;
      });
    }
  }, [parallax, depthImgSrc, showPerspectiveImage, imgRef]);

  const backgroundImage = useMemo(() => {
    const isBackgroundImageSvg = imgSrc.toLowerCase().endsWith('.svg');
    if (isBackgroundImageSvg) {
      const svg = require(`${imgSrc}`);
      return <svg.default
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${effectValue * (parallaxPosition.x) * -5}%, ${effectValue * (parallaxPosition.y) * -5}%)`
        }} />
    } else {
      return <PerspectiveImage
        img={require(`${imgSrc}?{sizes:[800, 1680], format: "webp"}`)}
        depthImg={require(`${depthImgSrc}?{sizes:[800, 1680], format: "webp"}`)}
        position={parallaxPosition}
        effectValue={effectValue * 0.25}
        perspectiveDisabled={!showPerspectiveImage}
        color={color}
      />
    }
  }, [imgSrc, depthImgSrc, parallaxPosition, effectValue, showPerspectiveImage, color]);

  return (
    <div
      key={id}
      style={style}
      className={`frame ${id}-frame ${active ? 'active' : ''} ${animate ? 'animate' : ''}`}
      onMouseMove={setParallaxPositionFromEvent}
      onMouseLeave={() => {
        if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        setParallaxPosition({ x: 0, y: 0 });
      }}
    >
      {hint}
      <div className="title-container">
        <div
          className="background-image parallax"
          ref={imgRef}
          style={{ transform: `translate(${(effectValue * 0.1 * (parallaxPosition.x)) * -100}%, ${(effectValue * 0.1 * (parallaxPosition.y)) * -100}%)` }}
        >
          {backgroundImage}
        </div>
        <h1 className="title parallax">
          {title}
        </h1>
      </div>
      <div className={`content-container ${active ? 'active' : ''}`}>
        <FrameCloseButton onClick={() => {
          onClick && onClick();
          setParallaxPosition({ x: 0, y: 0 });
        }} active={active} />
        <div className="content">
          {active && content}
        </div>
      </div>
    </div>
  );
};
