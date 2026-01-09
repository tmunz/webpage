import './Projects.css';

import React, { useRef } from 'react';
import { Icon } from '../../ui/icon/Icon';
import { IconName } from '../../ui/icon/IconName';
import { projects } from './ProjectsConfig';
import { Mux } from '../../ui/mux/Mux';
import { MuxProgram } from '../../ui/mux/MuxProgram';
import { MuxOs } from '../../ui/mux/MuxOs';

export function Projects(props: { onClose: () => void }) {

  const { current: programs } = useRef<MuxProgram[]>(projects.map(project => {
    const isFunction = typeof project.component === 'function';
    const componentFn: (muxOs: MuxOs) => React.ReactNode = isFunction 
      ? (project.component as ((muxOs: MuxOs) => React.ReactNode))
      : ((_muxOs: MuxOs) => project.component as React.ReactNode);
    
    return {
      ...project,
      pinned: project.highlight,
      about: <div className='project-about'>
        <div className='info'>{project.description}</div>
        {
          project.githubLink &&
          <div className="github-link">
            <a href={project.githubLink} target='_blank' rel='noopener noreferrer'>
              <Icon name={IconName.GITHUB} />
              <label className='tooltip'>Github</label>
            </a>
          </div>
        }
      </div>,
      component: componentFn,
      settings: project.settings
    };
  }));

  return <div className='projects'>
    <Mux programs={programs} onOff={props.onClose} />
  </div>;
}