import React from 'react';
import { Cli } from '../../visualization/Cli';

import './Projects.styl';

export function Projects(props: { onClose: () => void }) {

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
        if (!arg) return 'Please provide a project name';
        const project = projects.find(p => p.id === arg || p.name === arg);
        if (!project) return 'Project not found';
        // TODO open project.link
        return `Opening ${project.name} ...`;
      }, description: 'opens the selected project (name or id)'
    },
    {
      cmd: 'close', exec: () => {
        // TODO close project
        return `Close project ...`;
      }, description: 'closes the previously selected project'
    },
    { cmd: 'quit', exec: () => { props.onClose(); return 'quit'; }, description: 'quits the terminal and navigates back to the main overview' },
  ];

  return <div className='projects'>
    <Cli
      title='Projects'
      welcomeMessage={`Hello to the projects terminal, use "help" to get started\n_________________________________________________________\n`}
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
      } />
  </div>;
}