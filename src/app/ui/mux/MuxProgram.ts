import { ReactNode } from "react";
import { MuxOs } from "./MuxOs";

export interface MuxProgram {
  name: string;
  id: string;
  iconPath: string;
  description: string;
  component: (os: MuxOs) => ReactNode;
  about: ReactNode
  pinned?: boolean;
  slots?: string[];
}

export interface MuxProgramState {
  program: MuxProgram
  isRunning: boolean;
  window: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
