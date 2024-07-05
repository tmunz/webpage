import React from 'react';
import { Cli } from '../../ui/Cli';
import { Icon } from '../../ui/icon/Icon';
import { IconName } from '../../ui/icon/IconName';
import { AlphaBinaryClock } from '../../visualization/AlphaBinaryClock';

import './Projects.styl';


enum SelectionType { CLI, LIST }

export function Projects(props: { onClose: () => void }) {

  const [selectionType, setSelectionType] = React.useState<SelectionType>(SelectionType.CLI);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  const projects = [
    {
      name: 'Golden Seeds',
      id: 'gs',
      description: 'Web Application to generate SVGs based on mathematical rules.',
      githubLink: 'https://github.com/tmunz/GoldenSeeds',
      component: <iframe width='100%' height='100%' src='https://tmunz.github.io/GoldenSeeds/?name=golden+seeds' />,
    },
    {
      name: 'Magic Anagram',
      id: 'magic',
      description: 'Animate from a word to an anagram of it.',
      githubLink: 'https://github.com/tmunz/MagicAnagram',
      component: <iframe width='100%' height='100%' src='https://tmunz.github.io/MagicAnagram/' />,
    },
    {
      name: 'Pebble Alpha Binary',
      id: 'alpha',
      description: 'Binary Watchface for Pebble.',
      githubLink: 'https://github.com/tmunz/PebbleAlphaBinary',
      component: <AlphaBinaryClock />,
    },
    {
      name: 'Volley',
      id: 'volley',
      description: 'XBox Live Indie Game "Volley" by Glassbox Games (released in 2011)',
      component: <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/8l27WBWPRrU?si=RXYUEHcWNAUhGPYg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
    },
    {
      name: 'Youmigo',
      id: 'youmigo',
      description: 'Award winning Windows Phone App by Glassbox Games - Penpal 2.0',
      component: <div>TODO</div>,
    },
    {
      name: 'Canvacity',
      id: 'canvacity',
      description: 'Concept for the "Tomorrow Talks" contest',
      component: <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/DGJMyKJZBu8?si=3Ufo-i-X1Vk_o36w" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
    },
    {
      name: 'Inlinegraph',
      id: 'ig',
      description: 'jQuery-Library for inline graphs like heatmap, pie, and boolean representation',
      githubLink: 'https://github.com/tmunz/inlinegraph',
      component: <img src="https://raw.githubusercontent.com/tmunz/inlinegraph/master/img/inlinegraph_detail.png" width="100%" />,
    },
  ];

  const cmds: { cmd: string, description: string, exec: (arg?: string) => string }[] = [
    { cmd: 'help', exec: () => cmds.map(c => `- ${c.cmd}:\n    ${c.description}`).join('\n'), description: 'lists all commands with descriptions' },
    { cmd: 'ls', exec: () => projects.map(p => `- ${p.name} (${p.id})`).join('\n'), description: 'lists all projects with name and id' },
    {
      cmd: 'describe', exec: (arg?: string) => {
        if (!arg) {
          return 'Please provide a project name';
        }
        const project = projects.find(p => p.id === arg || p.name === arg);
        if (!project) {
          return 'Project not found';
        }
        return project?.description;
      }, description: 'describes the selected project (name or id)'
    },
    {
      cmd: 'open', exec: (arg?: string) => {
        if (!arg) {
          return 'Please provide a project name';
        }
        const project = projects.find(p => p.id === arg || p.name === arg);
        if (!project) {
          return 'Project not found';
        }
        setSelectedProject(project.id);
        return `Opening ${project.name} ...`;
      }, description: 'opens the selected project (name or id)'
    },
    {
      cmd: 'close', exec: () => {
        if (!selectedProject) {
          return 'No open project to close';
        } else {
          setSelectedProject(null);
          return `Close project ...`;
        }
      }, description: 'closes the previously selected project'
    },
    { cmd: 'quit', exec: () => { props.onClose(); return 'quit'; }, description: 'quits the terminal and navigates back to the main overview' },
  ];

  const project = projects.find(p => p.id === selectedProject);

  return <div className={`projects ${selectedProject ? 'project-selected' : ''}`}>
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
          <Cli
            title='Projects'
            welcomeMessage={`Hello to the Projects terminal, use "help" to get started\n_________________________________________________________\n`}
            promptLabel='>>>'
            cmds={
              (input: string) => {
                const args = input.split(/(?<=^\S+)\s/);
                const cmd = cmds.find(c => c.cmd === args[0]);
                if (cmd) {
                  return cmd.exec(args[1]);
                } else {
                  return 'Command not found';
                }
              }
            } /> :
          <ul>
            {projects.map(p => <li key={p.id}><button onClick={() => setSelectedProject(p.id)}>{p.name}</button></li>)}
          </ul>
        }
      </div>
    </div>
    <div className='project-content'>
      {
        project && <>
          <h2>{project.name}</h2>
          <p className='info'>{project.description}</p>
          {project.component}
          {
            project.githubLink &&
            <div className="github-link">
              <a href={project.githubLink} target='_blank' rel='noopener noreferrer'>
                <Icon name={IconName.GITHUB} />
                <label className='tooltip'>Github</label>
              </a>
            </div>
          }

        </>
      }
    </div>
  </div>;
}