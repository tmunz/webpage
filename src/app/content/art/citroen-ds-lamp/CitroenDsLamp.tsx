import './CitroenDsLamp.styl';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';

export function CitroenDsLamp(props: { width: number, height: number }) {

  const DIN_RATIO = 1.414;
  const GAP = 20;
  const portrait = props.width < props.height;

  const style = {
    width: portrait ? (((props.height - GAP) / DIN_RATIO)) : (props.width - GAP),
    height: portrait ? (props.height - GAP) : ((props.width - GAP) / DIN_RATIO),
  };

  console.log(style, props);

  return (
    <div className="citroen-ds-lamp">
      <ProjectDocument
        titleBlock={{
          project: 'Citroën DS Lamp',
          notes: 'Sketches are taken from the Citroën DS 19 Repair Manual and the Citroën Modèles "D" 1970-1971 Spare Parts Catalogue',
          creator: 'Tobias Munzert',
          dateStarted: '2024-01-11',
          dateCompleted: '2024-03-25',
          dimensions: '115 x 40 x 40',
          unit: 'cm',
          material: 'Metal, Wood, Fabric, Polypropylene',
          instructions: false,
          revision: '1.2'
        }}
      >
        <div className={`citroen-ds-lamp-content ${portrait ? 'citroen-ds-lamp-portrait' : ''}`} style={style}>
          {[
            './citroen_ds_lamp.png',
            './citroen_ds_tube.png',
            './citroen_ds_steering_wheel_2.png',
            './citroen_ds_indicatortrumpet.png',
            './citroen_ds_steering_wheel_1.png',

          ].map(img => <img {...require(`${img}`)} draggable={false} />)}
        </div>
      </ProjectDocument >
    </div>
  );
}
