import React, { useState } from 'react';
import Frame, { FrameProps } from './Frame';
import { Vita } from './content/vita/Vita';
import { Art } from './content/art/Art';
import { Projects } from './content/projects/Projects';
import { Lego } from './content/lego/Lego';
import { Photo } from './content/photo/Photo';

import './App.styl';


export function App() {

  const [selectedFrame, setSelectedFrame] = useState<null | string>(null);

  const frames: FrameProps[] = [
    { id: 'about', title: 'Vita', content: <Vita />, color: 'skyblue', imgSrc: './content/vita/vita_title.jpg' },
    { id: 'photo', title: 'Photography', content: <Photo />, color: 'green', imgSrc: './content/photo/photo_title.jpg' },
    { id: 'art', title: 'Art / Design', content: <Art />, color: 'orange', imgSrc: './content/art/art_title.jpg' },
    {
      id: 'projects', title: 'Projects / Coding' /* / Concepts / Creations */, content:
        <Projects onClose={() => handleClick('projects')} />, color: 'lightgrey', imgSrc: './content/projects/projects_title.png'
    },
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
