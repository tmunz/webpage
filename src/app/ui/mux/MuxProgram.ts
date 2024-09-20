import { ReactNode } from "react";
import { MuxOs } from "./MuxOs";

export interface MuxProgram {
  name: string;
  id: string;
  description: string;
  component: (os: MuxOs) => ReactNode;
  slots?: string[];
}
