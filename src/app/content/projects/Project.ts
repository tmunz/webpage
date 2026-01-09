import React from 'react';
import { MuxProgramConfig } from '../../ui/mux/MuxProgram';
import { MuxOs } from '../../ui/mux/MuxOs';

export interface Project {
  name: string;
  id: string;
  iconPath: string;
  iconMonoColor?: boolean;
  pinned?: boolean;
  description: string;
  githubLink?: string;
  component: ((muxOs: MuxOs) => React.ReactNode) | React.ReactNode,
  settings?: MuxProgramConfig,
  highlight?: boolean;
  slots?: string[];
}