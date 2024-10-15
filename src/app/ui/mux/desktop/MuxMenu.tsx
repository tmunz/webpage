import { MuxOs } from '../MuxOs';
import { MuxProgram } from '../MuxProgram';
import './MuxMenu.styl';
import React, { useState } from "react";

interface MuxMenuProps {
  programs: Map<string, MuxProgram>;
  onOpen: (programId: string) => void;
}


export const MuxMenu = ({ programs, onOpen }: MuxMenuProps) => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button className='mux-menu' onClick={() => setMenuOpen(o => !o)}>
        <div>menu</div>
      </button>
      {menuOpen && <div className='mux-menu-content'>
        <ul className='programs'>
          {[...programs.values()]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(p => (
              <li key={p.id}>
                <button onClick={() => {
                  onOpen(p.id);
                  setMenuOpen(false);
                }}>
                  <img src={p.iconPath} alt={p.name} />
                  <span>{p.name}</span>
                </button>
              </li>
            ))}
        </ul>
        <hr/>
        <ul className='controls'>
          <li><button onClick={() => MuxOs.get().pause()}>pause</button></li>
          <li><button onClick={() => MuxOs.get().shutdown()}>shutdown</button></li>
        </ul>
      </div>
      }
    </>
  );
}