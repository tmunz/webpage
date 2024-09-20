import React from "react";
import { Cli } from "../../ui/Cli";

interface ProjectsCliProps {
  projects: { id: string, name: string, description: string }[];
  getSelectedProject: () => string | null;
  setSelectedProject: (id: string | null) => void;
  onClose: () => void;
}

export const ProjectsCli = ({ projects, getSelectedProject, setSelectedProject, onClose }: ProjectsCliProps) => {

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
        if (!getSelectedProject()) {
          return 'No open project to close';
        } else {
          setSelectedProject(null);
          return `Close project ...`;
        }
      }, description: 'closes the previously selected project'
    },
    { cmd: 'quit', exec: () => { onClose(); return 'quit'; }, description: 'quits the terminal and navigates back to the main overview' },
  ];

  return <Cli
    title='Projects'
    welcomeMessage={`Hello to the Projects terminal, use "help" to get started\n_________________________________________________________\n`}
    promptLabel='>>>'
    cmds={
      (input: string) => {
        const args = input.split(/(?<=^\S+)\s/);
        const cmd = cmds.find(c => c.cmd.toLocaleLowerCase() === args[0].toLocaleLowerCase());
        if (cmd) {
          return cmd.exec(args[1]);
        } else {
          return 'Command not found';
        }
      }
    } />;
}