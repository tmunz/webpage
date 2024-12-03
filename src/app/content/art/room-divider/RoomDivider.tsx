import './RoomDivider.styl';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';
import { WebpImage } from '../../../ui/WebpImage';
import { useDinA } from '../../../utils/useDinA';

export function RoomDivider(props: { width: number, height: number }) {

  const GAP = 20;
  const { width, height } = useDinA(props.width - GAP, props.height - GAP);

  return (
    <div className={`room-divider`}>
      <ProjectDocument
        checkered
        titleBlock={{
          project: 'Room Divider',
          notes: <>see also <a href='https://tmunz.github.io/GoldenSeeds?name=room+divider' target='_blank'>tmunz.github.io/GoldenSeeds?name=room+divider</a></>,
          creator: 'Tobias Munzert',
          link: <a href='https://www.thingiverse.com/thing:6853717' target='_blank'>thing:6853717</a>,
          dateStarted: '2017-10-20',
          dateCompleted: '2018-02-17',
          dimensions: '162 x 172 x 4',
          unit: 'mm',
          material: '0.4mm Birch Plywood, Eyelets',
          instructions: true,
          revision: '1.0'
        }}
      >
        <div className='room-divider-content' style={{ width, height }}>
          {[
            './room_divider_1.jpg',
            './room_divider_2.png',
          ].map(img => <WebpImage key={img} src={require(`${img}`)} alt='Room Divider Construction Drawing' />)
          }</div>
      </ProjectDocument>
    </div>
  );
}
