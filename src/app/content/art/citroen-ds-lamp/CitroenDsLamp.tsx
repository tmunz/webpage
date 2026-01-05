import './CitroenDsLamp.css';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';
import { FlipCard } from '../../../effects/FlipCard';
import { CORNER, EDGE, Taped } from '../../../effects/Taped';
import { WebpImage } from '../../../ui/WebpImage';
import { useDinA } from '../../../utils/useDinA';

export function CitroenDsLamp(props: { width: number, height: number }) {

  const GAP = 20;
  const { width, height, portrait } = useDinA(props.width - GAP, props.height - GAP);

  return (
    <div className={`citroen-ds-lamp ${portrait ? 'citroen-ds-lamp-portrait' : ''}`}>
      <FlipCard>
        <ProjectDocument
          checkered
          titleBlock={{
            project: 'Citroën DS Lamp',
            notes: 'Sketches are taken from the Citroën DS 19 Repair Manual and the Citroën Modèles "D" 1970-1971 Spare Parts Catalogue',
            creator: 'Tobias Munzert',
            dateStarted: '2024-01-11',
            dateCompleted: '2024-03-25',
            dimensions: '160 x 40 x 40',
            unit: 'cm',
            material: 'Metal, Oak, Fabric, Polypropylene',
            instructions: false,
            revision: '1.2'
          }}
        >
          <div className='citroen-ds-lamp-content' style={{ width, height }}>
            {[
              './citroen_ds_lamp.png',
              './citroen_ds_tube.png',
              './citroen_ds_steering_wheel_2.png',
              './citroen_ds_indicatortrumpet.png',
              './citroen_ds_steering_wheel_1.png',
            ].map(img => <WebpImage key={img} src={require(`${img}`)} alt='Citroen DS Lamp Construction Drawing' />)
            }</div>
        </ProjectDocument>
        <div className='citroen-ds-lamp-backside'>
          {[
            './citroen_ds_lamp_detail_1.jpg',
            './citroen_ds_lamp_detail_2.jpg',
          ].map((img, i) => <Taped key={img} className='detail-image' tapes={(i % 4 + 1)} type={i === 0 ? EDGE : CORNER}><WebpImage src={require(`${img}`)} alt='Citroen DS Lamp Detail' /></Taped>)}
        </div>
      </FlipCard>
    </div>
  );
}
