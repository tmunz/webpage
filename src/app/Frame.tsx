import React, { MouseEvent, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import FrameControl from './FrameControl';

import './Frame.styl';


export interface FrameProps {
  id: string;
  title: string;
  content: ReactNode;
  color: string;
  imgSrc: string;
  onClick?: () => void;
  active?: boolean;
}

export default function Frame(props: FrameProps) {

  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [parallaxBackground, setParallaxBackground] = useState<boolean>(true);

  useEffect(() => {
    if (parallaxBackground === props.active) {
      setParallaxBackground(!props.active ?? true);
    }
  }, [props, parallaxBackground]);


  const setParallaxPosition = (event: MouseEvent<unknown>, ref: RefObject<HTMLElement>, multiplier: number = 1): void => {
    const element = ref.current;
    if (!element) return;
    const elementRect = element.getBoundingClientRect();
    const [offsetX, offsetY] = [
      (event.clientX - elementRect.left) / elementRect.width,
      (event.clientY - elementRect.top) / elementRect.height
    ];
    element.style.transform = `translate(${(multiplier * -0.5 + multiplier * offsetX) * 100}%, ${(multiplier * -0.5 + multiplier * offsetY) * 100}%)`;
  };

  const resetPosition = (ref: RefObject<HTMLElement>): void => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = '';
  };

  const isBackgroundImageSvg = props.imgSrc.toLowerCase().endsWith('.svg')
  const backgroundImage = isBackgroundImageSvg ?
    require(`${props.imgSrc}`) :
    require(`${props.imgSrc}?{sizes:[1680], format: "webp"}`);

  return (
    <div
      key={props.id}
      className={`frame ${props.id}-frame ${props.active ? 'active' : ''}`}
      style={{ backgroundColor: props.color }}
      onMouseMove={event => {
        if (parallaxBackground) {
          setParallaxPosition(event, imgRef, -0.1);
          // setParallaxPosition(event, titleRef, 0.1);
        }
      }}
      onMouseLeave={() => {
        if (parallaxBackground) {
          resetPosition(imgRef);
          // resetPosition(titleRef);
        }
      }}
    >
      <div className="title-container">
        {isBackgroundImageSvg ?
          <div
            className="background-image parallax"
            ref={imgRef}
          >
            <backgroundImage.default style={{ width: '100%', height: '100%' }} />
          </div>
          :
          <img
            className="background-image parallax"
            ref={imgRef}
            src={backgroundImage.default}
            srcSet={backgroundImage.srcSet}
          />
        }
        <h1 className="title parallax" ref={titleRef}>
          {props.title}
        </h1>
      </div>
      <div className={`content-container ${props.active ? 'active' : ''}`}>
        <FrameControl onClick={() => {
          props.onClick && props.onClick();
          resetPosition(imgRef);
          // resetPosition(titleRef);
        }} active={props.active} />
        <div className="content">
          {props.active && props.content}
        </div>
      </div>
    </div>
  );
}
