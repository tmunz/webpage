
import './App.css';

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Frame, FrameProps } from './Frame';
import { MainPage } from './main-page/MainPage';
import { Vita } from './content/vita/Vita';
import { Art } from './content/art/Art';
import { Projects } from './content/projects/Projects';
import { Bricks } from './content/bricks/Bricks';
import { Photo } from './content/photo/Photo';
import { IconButton } from './ui/icon/IconButton';
import { IconName } from './ui/icon/IconName';

const framePeek = (index: number) => `${5 + ((index  * 5) % 7) * 5 / 6}svh`;

export function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const [entrance, setEntrance] = useState<'closed' | 'staggered' | 'together'>(
    () => location.pathname === '/' ? 'closed' : 'together',
  );
  const framesRevealed = entrance !== 'closed';

  useEffect(() => {
    setAnimationEnabled(true);
  }, []);

  const frames: FrameProps[] = [
    { id: 'vita', title: 'Vita / About', icon: IconName.USER, content: <Vita />, color: '#a3dbfc', imgSrc: './content/vita/vita_title.jpg', depthImgSrc: './content/vita/vita_title_depth.jpg' },
    { id: 'photo', title: 'Photography', icon: IconName.CAMERA, content: <Photo />, color: '#aadbc3', imgSrc: './content/photo/photo_title.jpg', depthImgSrc: './content/photo/photo_title_depth.jpg' },
    { id: 'art', title: 'Design / Art', icon: IconName.PALETTE, content: <Art />, color: '#e84a0c', imgSrc: './content/art/art_title.jpg', depthImgSrc: './content/art/art_title_depth.jpg' },
    { id: 'projects', title: 'Projects / Coding', icon: IconName.CODE, content: <Projects onClose={() => handleClick('projects')} />, color: '#222222', imgSrc: './content/projects/projects_title.svg' },
    { id: 'bricks', title: 'Bricks', icon: IconName.BRICK, content: <Bricks />, color: '#d9b77f', imgSrc: './content/bricks/bricks_title.jpg', depthImgSrc: './content/bricks/bricks_title_depth.jpg' },
    /* / Concepts / Creations */
  ];

  const getCurrentId = () => {
    const id = location.pathname.split('/')[1];
    return id.length > 0 ? id : null;
  };

  const handleClick = (id: string) => {
    if (!framesRevealed) setEntrance('together');
    const selectedId = id === getCurrentId() ? null : id;
    navigate(`/${selectedId || ''}`);
  };

  return (
    <div className={`app ${framesRevealed ? 'app--revealed' : 'app--waiting'}`}>
      <MainPage
        revealed={framesRevealed}
        onToggle={() => {
          setEntrance(framesRevealed ? 'closed' : 'staggered');
          if (framesRevealed) navigate('/');
        }}
      />
      <div className="category-frames">
        {frames.map((frame, index) => (
          <Frame
            key={frame.id}
            activeId={getCurrentId()}
            onClick={() => handleClick(frame.id)}
            animate={animationEnabled}
            effectValue={0.7}
            {...frame}
            hint={
              <div className="category-guide" aria-hidden={framesRevealed}
                {...(framesRevealed ? { inert: '' } : {})}>
                <IconButton name={frame.icon} iconColor="none" className="category-guide-button"
                  aria-label={frame.title} tooltip={frame.title}
                  onClick={() => handleClick(frame.id)} />
              </div>
            }
            style={{
              '--frame-peek': framePeek(index),
              '--frame-delay': `${entrance === 'staggered' ? index * 120 : 0}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
