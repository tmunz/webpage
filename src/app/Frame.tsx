import React, { ReactNode, useState } from 'react';
import { About } from './content/about/About';
import { Art } from './content/art/Art';
import { Projects } from './content/projects/Projects';
import { Lego } from './content/lego/Lego';
import { Photo } from './content/photo/Photo';

import './Frame.styl';


interface FrameComponent {
  id: string;
  title: string;
  content: ReactNode;
  color: string;
  img: string;
}

function Frame() {

  const [selectedComponent, setSelectedComponent] = useState<null | FrameComponent>(null);

  const components: FrameComponent[] = [
    { id: 'about', title: 'About', content: <About />, color: 'skyblue', img: './content/about/about_title.jpg' },
    { id: 'art', title: 'Art', content: <Art />, color: '#fff', img: './content/art/art_title.png' },
    { id: 'photo', title: 'Photography', content: <Photo />, color: 'green', img: './content/photo/photo_title.jpg' },
    { id: 'projects', title: 'Coding, Concepts & Creations', content: <Projects />, color: 'grey', img: './content/projects/projects_title.png' },
    { id: 'lego', title: 'Lego', content: <Lego />, color: 'red', img: './content/lego/lego_title.jpg' },
  ];

  const handleComponentClick = (component: FrameComponent) => {
    setSelectedComponent(component.id === selectedComponent?.id ? null : component);
  };

  return (
    <div className="frame">
      {components.map((component) => (
        <div
          key={component.id}
          className={`component ${selectedComponent?.id === component.id ? 'active' : ''}`}
          onClick={() => handleComponentClick(component)}
          style={{ backgroundColor: component.color, backgroundImage: `url(${require('' + component.img)})` }}
        >
          <h2 className="title">{component.title}</h2>
          <div className="content">{selectedComponent?.id === component.id && selectedComponent.content}</div>
        </div>
      ))}
    </div>
  );
}

export default Frame;