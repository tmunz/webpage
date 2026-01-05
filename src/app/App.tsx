
import './App.css';

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
  const [animationEnabled, setAnimationEnabled] = useState(false);

  useEffect(() => {
    setAnimationEnabled(true);
  });

  const frames: FrameProps[] = [
    { id: 'vita', title: 'Vita / About', content: <Vita />, color: '#a3dbfc', imgSrc: './content/vita/vita_title.jpg', depthImgSrc: './content/vita/vita_title_depth.jpg' },
    { id: 'photo', title: 'Photography', content: <Photo />, color: '#aadbc3', imgSrc: './content/photo/photo_title.jpg', depthImgSrc: './content/photo/photo_title_depth.jpg' },
    { id: 'art', title: 'Design / Art', content: <Art />, color: '#e84a0c', imgSrc: './content/art/art_title.jpg', depthImgSrc: './content/art/art_title_depth.jpg' },
    { id: 'projects', title: 'Projects / Coding', content: <Projects onClose={() => handleClick('projects')} />, color: '#222222', imgSrc: './content/projects/projects_title.svg' },
    { id: 'bricks', title: 'Bricks', content: <Bricks />, color: '#d9b77f', imgSrc: './content/bricks/bricks_title.jpg', depthImgSrc: './content/bricks/bricks_title_depth.jpg' },
    /* / Concepts / Creations */
  ];

  const getCurrentId = () => {
    const id = location.pathname.split('/')[1];
    return id.length > 0 ? id : null;
  }

  const handleClick = (id: string) => {
    const selectedId = id === getCurrentId() ? null : id;
    navigate(`/${selectedId || ''}`);
  };

  return (
    <div className="app">
      {frames.map((frame) => (
        <Frame
          key={frame.id}
          activeId={getCurrentId()}
          onClick={() => handleClick(frame.id)}
          animate={animationEnabled}
          effectValue={0.7}
          {...frame}
        />
      ))}
    </div>
  );
}
