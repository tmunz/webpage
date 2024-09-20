import React from "react";
import { Log } from "./MuxOs";
import { SerialWriter } from "../../effects/SerialWriter";

interface MuxBootScreenProps {
  id: string;
  stdout: Log[];
};


export const MuxBootScreen = ({ id, stdout }: MuxBootScreenProps) => {

  const text = stdout.map(log => log.message).join('\n');

  return (
    <div className='mux-boot-screen'>
      <SerialWriter content={text} contentId={id} />
    </div>
  );
};