import './Projects.styl';

import React, { useRef } from 'react';
import { Icon } from '../../ui/icon/Icon';
import { IconName } from '../../ui/icon/IconName';
import { projects } from './ProjectsConfig';
import { Mux } from '../../ui/mux/Mux';
import { MuxProgram } from '../../ui/mux/MuxProgram';

export function Projects(props: { onClose: () => void }) {

  const { current: programs } = useRef<MuxProgram[]>(projects.map(project => ({
    name: project.name,
    id: project.id,
    iconPath: project.iconPath,
    description: project.description,
    pinned: project.highlight,
    slots: project.slots,
    about: <div className='project-about'>
      <p className='info'>{project.description}</p>
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
    component: () => project.component
  })));

  return <div className='projects'>
    <Mux programs={programs} onShutdown={props.onClose} />
  </div>;
}