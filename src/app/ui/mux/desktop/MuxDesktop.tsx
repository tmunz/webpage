import './MuxDesktop.styl';
import React, { useState } from "react";
import { MuxTaskbar } from "./MuxTaskbar";
import { MuxMainWindow } from "./MuxMainWindow";
import { MuxProgram } from '../MuxProgram';
import { MuxTheme } from '../MuxTheme';
import { MuxMenuButton } from './MuxMenuButton';
import { MuxProgramSelection } from './MuxProgramSelection';

export const MuxDesktop = ({ programs, theme }: { programs: Map<string, MuxProgram>, theme: MuxTheme }) => {

  const [openProgramId, setOpenProgramId] = useState<string | null>(null);

  const openProgram = openProgramId ? programs.get(openProgramId) : null;

  return (
    <div className={`mux-desktop`}>
      <MuxProgramSelection onOpen={setOpenProgramId} programs={programs} />
      <MuxMenuButton color={theme.menuColor} />
      <MuxMainWindow onClose={() => setOpenProgramId(null)} program={openProgram} />
      <MuxTaskbar theme={theme} />
    </div >
  );
}