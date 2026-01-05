import './Kitchen.css';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';
import { WebpImage } from '../../../ui/WebpImage';
import { useDinA } from '../../../utils/useDinA';

export function Kitchen(props: { width: number, height: number }) {

  const GAP = 20;
  const { width, height } = useDinA(props.width - GAP, props.height - GAP);

  return (
    <div className={`kitchen`}>
      <ProjectDocument
        checkered
        titleBlock={{
          project: 'Kitchen appliances',
          notes: 'Kitchen roll holder and knife block',
          creator: 'Tobias Munzert',
          link: <></>,
          dateStarted: '2024-12-15',
          dateCompleted: '2025-01-06',
          dimensions: '',
          unit: '',
          material: 'Aluminium, Wood, Acryl glass',
          instructions: false,
          revision: '1.0'
        }}
      >
        <div className='kitchen-content' style={{ width, height }}>
          {[
            './kitchen_1.jpg',
            './kitchen_2.jpg',
          ].map(img => <WebpImage key={img} src={require(`${img}`)} alt='Kitchen' />)
          }</div>
      </ProjectDocument>
    </div>
  );
}
