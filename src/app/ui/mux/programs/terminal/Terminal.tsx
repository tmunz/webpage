import React from 'react';
import { Cli } from '../../../Cli';
import { MuxProgram } from '../../MuxProgram';
import { MuxOs } from '../../MuxOs';

interface MuxCliProps {
  programs: MuxProgram[];
  onStartProgram: (id: string) => void;
  onQuitProgram: (id: string) => void;
  onShutdownRequest: () => void;
  onPauseRequest: () => void;
}

const TerminalComponent = ({ programs, onStartProgram, onQuitProgram, onShutdownRequest, onPauseRequest }: MuxCliProps) => {

  const cmds: { cmd: string, description: string, exec: (arg?: string) => string }[] = [
    { cmd: 'help', exec: () => cmds.map(c => `- ${c.cmd}:\n    ${c.description}`).join('\n'), description: 'lists all commands with descriptions' },
    { cmd: 'ls', exec: () => programs.map(p => `- ${p.name} (${p.id})`).join('\n'), description: 'lists all programs with name and id' },
    {
      cmd: 'describe', exec: (arg?: string) => {
        if (!arg) {
          return 'please provide a program name';
        }
        const program = programs.find(p => p.id === arg || p.name === arg);
        if (!program) {
          return 'program not found';
        }
        return program?.description;
      }, description: 'describes the selected program (name or id)'
    },
    {
      cmd: 'start', exec: (arg?: string) => {
        if (!arg) {
          return 'please provide a program name';
        }
        const program = programs.find(p => p.id === arg || p.name === arg);
        if (!program) {
          return 'program not found';
        }
        onStartProgram(program.id);
        return `starting ${program.name} ...`;
      }, description: 'starts the selected program (name or id)'
    },
    {
      cmd: 'quit', exec: (arg?: string) => {
        if (!arg) {
          return 'please provide a program name';
        }
        const program = programs.find(p => p.id === arg || p.name === arg);
        if (!program) {
          return 'program not found';
        }
        onQuitProgram(program.id);
        return `quitting ${program.name} ...`;
      }, description: 'quits the selected program (name or id)'
    },
    { cmd: 'shutdown', exec: () => { onShutdownRequest(); return 'shutdown'; }, description: 'turns off MuxOs' },
    { cmd: 'pause', exec: () => { onPauseRequest(); return 'pause'; }, description: 'turns off MuxOs but state remains when restarting' },
  ];

  return <Cli
    title='Terminal'
    welcomeMessage={`Welcome to the Terminal, use 'help' to get started\n_________________________________________________________\n`}
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
  description: 'MuxOs standard cli',
  component: (muxOs: MuxOs) => TerminalComponent({
    programs: [...muxOs.programs$.getValue().values()],
    onStartProgram: (programId) => muxOs.startProgram(programId),
    onQuitProgram: (programId) => muxOs.quitProgram(programId),
    onShutdownRequest: () => muxOs.shutdown(),
    onPauseRequest: () => muxOs.pause(),
  }),
  about: <div>System Standard Command Line Interface</div>,
  iconPath: require('./terminal-icon.png'),
  iconMonoColor: true,
  pinned: true,
}