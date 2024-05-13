import React, { MouseEvent, ReactNode, RefObject, useRef } from 'react';
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

  const handleMouseMove = (event: MouseEvent<unknown>, ref: RefObject<HTMLElement>, multiplier: number = 1): void => {
    const element = ref.current;
    if (!element) return;
    const elementRect = element.getBoundingClientRect();
    const [offsetX, offsetY] = [
      (event.clientX - elementRect.left) / elementRect.width,
      (event.clientY - elementRect.top) / elementRect.height
    ];
    element.style.transform = `translate(${(multiplier * -0.5 + multiplier * offsetX) * 100}%, ${(multiplier * -0.5 + multiplier * offsetY) * 100}%)`;
  };

  const handleMouseLeave = (ref: RefObject<HTMLElement>): void => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      key={props.id}
      className={`frame ${props.active ? 'active' : ''}`}
      style={{ backgroundColor: props.color }}
      onMouseMove={event => {
        handleMouseMove(event, imgRef, -0.1);
        // handleMouseMove(event, titleRef, 0.1);
      }}
      onMouseLeave={() => {
        handleMouseLeave(imgRef);
        // handleMouseLeave(titleRef);
      }}
    >
      <div className="title-container">
        <img className="background-image parallax"
          ref={imgRef}
          src={`${require('' + props.imgSrc)}`}
          style={{ transform: 'translate(0, 0)' }}
        />
        <h1 className="title parallax" ref={titleRef}>
          {props.title}
        </h1>
      </div>
      <div className={`content-container ${props.active ? 'active' : ''}`}>
        <FrameControl onClick={props.onClick} active={props.active} />
        <div className="content">
          {props.active && props.content}
        </div>
      </div>
    </div>
  );
}
