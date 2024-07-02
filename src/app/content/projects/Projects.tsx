import React from 'react';
import { Cli } from '../../visualization/Cli';

import './Projects.styl';
import { Icon } from '../../icon/Icon';
import { IconName } from '../../icon/IconName';


enum SelectionType { CLI, LIST }

export function Projects(props: { onClose: () => void }) {

  const [selectionType, setSelectionType] = React.useState<SelectionType>(SelectionType.CLI);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  const projects = [
    { name: 'Golden Seeds', id: 'gs', link: '...' },
    { name: 'Pebble Alpha Binary', id: 'alpha', link: '...' },
    { name: 'Magic Anagram', id: 'magic', link: '...' },
    { name: 'Glassbox', id: 'glassbox', link: '(Volley)' },
    { name: 'Concepts', id: 'concepts', link: ' (Canvacity)' },
    { name: 'inlinegraph', id: 'ig', link: '...' },
  ];

  const cmds: { cmd: string, description: string, exec: (arg?: string) => string }[] = [
    { cmd: 'help', exec: () => cmds.map(c => `- ${c.cmd}:\n    ${c.description}`).join('\n'), description: 'lists all commands with descriptions' },
    { cmd: 'ls', exec: () => projects.map(p => `- ${p.name} (${p.id})`).join('\n'), description: 'lists all projects with name and id' },
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
          return 'No project selected';
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
      <h2>{project?.name}</h2>
      <p>coming soon</p>
    </div>
  </div>;
}