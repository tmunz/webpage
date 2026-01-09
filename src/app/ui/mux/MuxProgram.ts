import { ReactNode } from 'react';
import { MuxOs } from './MuxOs';

export enum MuxProgramConfigInputType {
  NUMBER = 'number',
  BOOLEAN = 'checkbox',
  COLOR = 'color',
  TEXT = 'text'
}

export interface MuxProgramConfigField {
  label: string;
  type: MuxProgramConfigInputType;
  name: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface MuxProgramConfig<T = any> {
  fields: MuxProgramConfigField[];
  values: T;
  onChange: (values: T) => void;
  subscribe?: (listener: (values: T) => void) => () => void;
}

export interface MuxProgram {
  name: string;
  id: string;
  iconPath: string;
  iconMonoColor?: boolean;
  description: string;
  component: (muxOs: MuxOs) => ReactNode;
  settings?: MuxProgramConfig;
  about: ReactNode
  pinned?: boolean;
  slots?: string[];
}

export interface MuxProgramState {
  program: MuxProgram
  isRunning: boolean;
}
