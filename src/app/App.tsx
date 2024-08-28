
import './App.styl';

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Frame, FrameProps } from './Frame';
import { Vita } from './content/vita/Vita';
import { Art } from './content/art/Art';
import { Projects } from './content/projects/Projects';
import { Bricks } from './content/bricks/Bricks';
import { Photo } from './content/photo/Photo';


export function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFrame, setSelectedFrame] = useState<null | string>(null);

  const frames: FrameProps[] = [
    { id: 'vita', title: 'Vita', content: <Vita />, imgSrc: './content/vita/vita_title.jpg' },
    { id: 'photo', title: 'Photography', content: <Photo />, imgSrc: './content/photo/photo_title.jpg' },
    { id: 'art', title: 'Art / Design', content: <Art />, imgSrc: './content/art/art_title.jpg' },
    { id: 'projects', title: 'Projects / Coding', content: <Projects onClose={() => handleClick('projects')} />, imgSrc: './content/projects/projects_title.svg' },
    { id: 'bricks', title: 'Bricks', content: <Bricks />, imgSrc: './content/bricks/bricks_title.jpg' },
    /* / Concepts / Creations */
  ];

  const handleClick = (id: string) => {
    const selectedId = id === selectedFrame ? null : id;
    navigate(`/${selectedId || ''}`);
  };

  useEffect(() => {
    const path = location.pathname.slice(1); // Remove the leading slash
    if (frames.some(frame => frame.id === path)) {
      setSelectedFrame(path);
    } else {
      setSelectedFrame(null);
    }
  }, [location.pathname]);

  return (
    <div className="app">
      {frames.map((frame, i) => (
        <Frame
          key={frame.id}
          active={selectedFrame === frame.id}
          onClick={() => handleClick(frame.id)}
          id={frame.id}
          title={frame.title}
          content={frame.content}
          imgSrc={frame.imgSrc}
        />
      ))}
    </div>
  );
}
