import './CitroenDsLamp.styl';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';
import { FlipCard } from '../../../effects/FlipCard';
import { CORNER, EDGE, Taped } from '../../../effects/Taped';

export function CitroenDsLamp(props: { width: number, height: number }) {

  const DIN_RATIO = 1.414;
  const GAP = 20;
  const portrait = props.width < props.height;

  const style = {
    width: portrait ? (((props.height - GAP) / DIN_RATIO)) : (props.width - GAP),
    height: portrait ? (props.height - GAP) : ((props.width - GAP) / DIN_RATIO),
  };

  return (
    <div className={`citroen-ds-lamp ${portrait ? 'citroen-ds-lamp-portrait' : ''}`}>
      <FlipCard>
        <ProjectDocument
          titleBlock={{
            project: 'Citroën DS Lamp',
            notes: 'Sketches are taken from the Citroën DS 19 Repair Manual and the Citroën Modèles "D" 1970-1971 Spare Parts Catalogue',
            creator: 'Tobias Munzert',
            dateStarted: '2024-01-11',
            dateCompleted: '2024-03-25',
            dimensions: '160 x 40 x 40',
            unit: 'cm',
            material: 'Metal, Wood, Fabric, Polypropylene',
            instructions: false,
            revision: '1.2'
          }}
        >
          <div className='citroen-ds-lamp-content' style={style}>
            {[
              './citroen_ds_lamp.png',
              './citroen_ds_tube.png',
              './citroen_ds_steering_wheel_2.png',
              './citroen_ds_indicatortrumpet.png',
              './citroen_ds_steering_wheel_1.png',

            ].map(img => <img {...require(`${img}`)} draggable={false} />)}
          </div>
        </ProjectDocument>
        <div className='citroen-ds-lamp-backside'>
          {[
            './citroen_ds_lamp_detail_1.jpg',
            './citroen_ds_lamp_detail_2.jpg',
          ].map((img, i) => <Taped className='detail-image' tapes={(i % 4 + 1)} type={i === 0 ? EDGE : CORNER}><img {...require(`${img}`)} draggable={false} /></Taped>)}
        </div>
      </FlipCard>
    </div>
  );
}
