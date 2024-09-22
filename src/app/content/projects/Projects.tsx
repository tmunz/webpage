import './Projects.styl';

import React, { useRef } from 'react';
import { Icon } from '../../ui/icon/Icon';
import { IconName } from '../../ui/icon/IconName';
import { projects } from './ProjectsConfig';
import { Mux } from '../../ui/mux/Mux';

export function Projects(props: { onClose: () => void }) {

  const { current: programs } = useRef(projects.map(project => ({
    name: project.name,
    id: project.id,
    description: project.description,
    about: () => <div className='project-about'>
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

{/* 

   ${selectedProject ? 'project-selected' : ''
  enum SelectionType { CLI, LIST }
    const [selectionType, setSelectionType] = React.useState<SelectionType>(SelectionType.CLI);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  const project = projects.find(p => p.id === selectedProject);
  
  <div className='selection-wrapper'>
      <div className='selection-type'> {
        [{ id: SelectionType.CLI }, { id: SelectionType.LIST }]
          .map((s) => <button key={s.id} className={selectionType === s.id ? 'active' : ''} onClick={() => setSelectionType(s.id)}>
            <Icon name={s.id === SelectionType.CLI ? IconName.CLI : IconName.LIST}></Icon>
          </button>)
      }
      </div>
      <div className='project-selection'>
        {selectionType === SelectionType.CLI ?
          <ProjectsCli
            projects={projects}
            getSelectedProject={() => selectedProject}
            setSelectedProject={setSelectedProject}
            onClose={props.onClose}
          /> :
          <ProjectsList
            projects={projects}
            setSelectedProject={setSelectedProject}
          />
        }
      </div>
    </div>
    <div className='content-wrapper'>
      {
        project &&
      }
    </div> */
}