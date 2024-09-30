import './MuxDesktop.styl';
import React, { useState } from "react";
import { MuxTaskbar } from "./MuxTaskbar";
import { MuxMainWindow } from "./MuxMainWindow";
import { MuxProgram } from '../MuxProgram';
import { MuxTheme } from '../MuxTheme';
import { MuxMenu } from './MuxMenu';

export const MuxDesktop = ({ programs, theme }: { programs: Map<string, MuxProgram>, theme: MuxTheme }) => {

  const [openProgramId, setOpenProgramId] = useState<string | null>(null);

  return (
    <div className={`mux-desktop ${openProgramId !== null ? 'mux-desktop-program-running' : ''}`}>
      <MuxMenu theme={theme} onOpen={setOpenProgramId} programs={programs} />
      <MuxMainWindow onClose={() => setOpenProgramId(null)} program={openProgramId ? programs.get(openProgramId) : null} />
      <MuxTaskbar theme={theme} onOpen={setOpenProgramId} programs={programs} />
    </div >
  );
}