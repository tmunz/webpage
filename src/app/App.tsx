import React, { useState } from 'react';
import Frame, { FrameProps } from './Frame';
import { About } from './content/about/About';
import { Art } from './content/art/Art';
import { Projects } from './content/projects/Projects';
import { Lego } from './content/lego/Lego';
import { Photo } from './content/photo/Photo';

import './App.styl';


export function App() {

  const [selectedFrame, setSelectedFrame] = useState<null | string>(null);

  const frames: FrameProps[] = [
    { id: 'about', title: 'About / Vita', content: <About />, color: 'skyblue', imgSrc: './content/about/about_title.jpg' },
    { id: 'photo', title: 'Photography', content: <Photo />, color: 'green', imgSrc: './content/photo/photo_title.jpg' },
    { id: 'art', title: 'Art / Design', content: <Art />, color: '#fff', imgSrc: './content/art/art_title.png' },
    { id: 'projects', title: 'Coding / Concepts / Creations', content: <Projects />, color: 'grey', imgSrc: './content/projects/diy_title.jpg' },
    { id: 'lego', title: 'Lego', content: <Lego />, color: 'red', imgSrc: './content/lego/lego_title.jpg' },
  ];

  const handleClick = (id: string) => {
    setSelectedFrame(id === selectedFrame ? null : id);
  };

  return (
    <div className="app">
      {frames.map((frame) => (
        <Frame
          key={frame.id}
          active={selectedFrame === frame.id}
          onClick={() => handleClick(frame.id)}
          {...frame}
        />
      ))}
    </div>
  );
}
