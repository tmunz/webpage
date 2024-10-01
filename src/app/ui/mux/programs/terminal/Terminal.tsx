import React from "react";
import { Cli } from "../../../Cli";
import { MuxProgram } from "../../MuxProgram";
import { MuxOs } from "../../MuxOs";

interface MuxCliProps {
  programs: { id: string, name: string, description: string }[];
  getSelectedProgram: () => string | null;
  setSelectedProgram: (id: string | null) => void;
  onClose: () => void;
}

const TerminalComponent = ({ programs, getSelectedProgram, setSelectedProgram, onClose }: MuxCliProps) => {

  const cmds: { cmd: string, description: string, exec: (arg?: string) => string }[] = [
    { cmd: 'help', exec: () => cmds.map(c => `- ${c.cmd}:\n    ${c.description}`).join('\n'), description: 'lists all commands with descriptions' },
    { cmd: 'ls', exec: () => programs.map(p => `- ${p.name} (${p.id})`).join('\n'), description: 'lists all programs with name and id' },
    {
      cmd: 'describe', exec: (arg?: string) => {
        if (!arg) {
          return 'Please provide a program name';
        }
        const program = programs.find(p => p.id === arg || p.name === arg);
        if (!program) {
          return 'Program not found';
        }
        return program?.description;
      }, description: 'describes the selected program (name or id)'
    },
    {
      cmd: 'open', exec: (arg?: string) => {
        if (!arg) {
          return 'Please provide a program name';
        }
        const program = programs.find(p => p.id === arg || p.name === arg);
        if (!program) {
          return 'Program not found';
        }
        setSelectedProgram(program.id);
        return `Opening ${program.name} ...`;
      }, description: 'opens the selected program (name or id)'
    },
    {
      cmd: 'close', exec: () => {
        if (!getSelectedProgram()) {
          return 'No open program to close';
        } else {
          setSelectedProgram(null);
          return `Close program ...`;
        }
      }, description: 'closes the previously selected program'
    },
    { cmd: 'quit', exec: () => { onClose(); return 'quit'; }, description: 'quits muxOS and navigates back to the main overview' },
  ];

  return <Cli
    title='Terminal'
    welcomeMessage={`Welcome to the Terminal, use "help" to get started\n_________________________________________________________\n`}
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

export const Terminal: MuxProgram = {
  name: 'Terminal',
  id: 'terminal',
  description: 'standard cli',
  component: (muxOs: MuxOs) => TerminalComponent({ programs: [], getSelectedProgram: () => null, setSelectedProgram: () => {}, onClose: () => {} }), // TODO
  about: <div>System Standard Command Line Interface</div>,
  iconPath: require('./terminal-icon.png'),
}