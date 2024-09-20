import React from "react";

export const MuxMenuButton = ({ color }: { color: string }) => {
  return (
    <button className='mux-menu-button' style={{ width: '100%', height: '100%', backgroundColor: color }}>
      <div>menu</div>
    </button>
  );
}