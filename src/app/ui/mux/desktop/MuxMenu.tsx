import './MuxMenu.styl';
import React from "react";
import { MuxProgram } from "../MuxProgram";
import { MuxTheme } from "../MuxTheme";

interface MuxMenuProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
  theme: MuxTheme;
}


export const MuxMenu = ({ programs, onOpen, theme }: MuxMenuProps) => {


  return (
    <button className='mux-menu'>
      <div>menu</div>
    </button>
  );
}