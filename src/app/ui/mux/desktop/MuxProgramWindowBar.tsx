import './MuxProgramWindowBar.styl';
import React from "react"

export const MuxProgramWindowBar = ({ title, onClose }: { title: string, onClose: () => void }) => {

  return <div className="mux-program-window-bar">
    <div>{title}</div>
    <button onClick={onClose}>close</button>
  </div>

}