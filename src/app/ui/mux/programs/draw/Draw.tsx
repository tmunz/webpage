import './Draw.styl';
import React from 'react';
import { MuxProgram } from '../../MuxProgram';
import { DrawWithControls } from '../../../draw/DrawWithControls';
import { useDimension } from '../../../../utils/useDimension';

const DrawComponent = () => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dimensions = useDimension(elementRef);

  return (
    <div className='draw-program' ref={elementRef}>
      <DrawWithControls width={dimensions?.width ?? 800} height={dimensions?.height ?? 600} />
    </div>
  );
}

export const Draw: MuxProgram = {
  name: 'Draw',
  id: 'draw',
  description: 'image drawing program',
  component: () => DrawComponent(),
  about: <div>MuxOs Standard Drawing Program</div>,
  iconPath: require('./draw_icon.png'),
  iconMonoColor: true,
}