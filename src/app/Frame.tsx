import './Frame.styl';
import React, { MouseEvent, ReactNode, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import FrameCloseButton from './ui/FrameCloseButton';
import { PerspectiveImage } from './effects/PerspectiveImage';


export interface FrameProps {
  id: string;
  title: string;
  content: ReactNode;
  imgSrc: string;
  depthImgSrc?: string;
  onClick?: () => void;
  activeId?: string | null;
  animate?: boolean;
  effectValue?: number;
}

export const Frame = ({ id, title, content, imgSrc, depthImgSrc, onClick, activeId, animate, effectValue = 1 }: FrameProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [parallaxPosition, setParallaxPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [showPerspectiveImage, setShowPerspectiveImage] = useState(false);

  const active = activeId === id;
  const parallax = !activeId;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (depthImgSrc) {
      // delay showing perspective image to prevent flickering
      timeoutId = setTimeout(() =>  setShowPerspectiveImage(parallax), 200);
    }
    return () => clearTimeout(timeoutId);
  }, [depthImgSrc, parallax]);

  const setParallaxPositionFromEvent = useCallback((event: MouseEvent<unknown>): void => {
    if (parallax && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setParallaxPosition({
        x: ((event.clientX - rect.left) / rect.width - 0.5),
        y: - ((event.clientY - rect.top) / rect.height - 0.5),
      });
    }
  }, [parallax, imgRef]);

  const getBackgroundImage = useCallback(() => {
    const isBackgroundImageSvg = imgSrc.toLowerCase().endsWith('.svg');
    if (isBackgroundImageSvg) {
      const svg = require(`${imgSrc}`);
      return <svg.default
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${effectValue * (parallaxPosition.x) * -5}%, ${effectValue * (parallaxPosition.y) * 5}%)`
        }} />
    } else {
      const img = require(`${imgSrc}?{sizes:[1680], format: "webp"}`);
      return <>
        <img
          src={img.default}
          srcSet={img.srcSet}
        />
        {depthImgSrc && parallax && showPerspectiveImage &&
          <PerspectiveImage
            img={require(`${imgSrc}`)}
            depthImg={require(`${depthImgSrc}`)}
            position={parallaxPosition}
            effectValue={effectValue * 0.25}
          />
        }
      </>
    }
  }, [imgSrc, depthImgSrc, parallaxPosition, effectValue, parallax, showPerspectiveImage]);

  return (
    <div
      key={id}
      className={`frame ${id}-frame ${active ? 'active' : ''} ${animate ? 'animate' : ''}`}
      onMouseMove={setParallaxPositionFromEvent}
      onMouseLeave={() => { setParallaxPosition({ x: 0, y: 0 }) }}
    >
      <div className="title-container">
        <div
          className="background-image parallax"
          ref={imgRef}
          style={{ transform: `translate(${(effectValue * 0.1 * (parallaxPosition.x)) * -100}%, ${(effectValue * 0.1 * (parallaxPosition.y)) * 100}%)` }}
        >
          {getBackgroundImage()}
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
