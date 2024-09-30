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
