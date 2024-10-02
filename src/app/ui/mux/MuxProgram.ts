import { ReactNode } from "react";
import { MuxOs } from "./MuxOs";
import { MuxGui } from "./MuxGui";

export interface MuxProgram {
  name: string;
  id: string;
  iconPath: string;
  description: string;
  component: (os: MuxOs, gui: MuxGui) => ReactNode;
  about: ReactNode
  pinned?: boolean;
  slots?: string[];
}
