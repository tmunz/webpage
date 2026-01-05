import './KidsBookshelf.css';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';
import { WebpImage } from '../../../ui/WebpImage';
import { useDinA } from '../../../utils/useDinA';
import { FlipCard } from '../../../effects/FlipCard';
import { CORNER, EDGE, Taped } from '../../../effects/Taped';

export function KidsBookshelf(props: { width: number, height: number }) {

  const GAP = 20;
  const { width, height } = useDinA(props.width - GAP, props.height - GAP);

  return (
    <div className={`kids-bookshelf`}>
      <FlipCard>
        <ProjectDocument
          checkered
          titleBlock={{
            project: 'Kids Bookshelf',
            notes: 'A bookshelf for compact parallel storage or front-facing book display fitting behind a door.',
            creator: 'Tobias Munzert',
            link: <></>,
            dateStarted: '2025-02-10',
            dateCompleted: '2025-06-23',
            dimensions: '112 x 50 x 34',
            unit: 'cm',
            material: 'Poplar Plywood 6mm and 12mm',
            instructions: false,
            revision: '1.0'
          }}
        >
          <div className='kids-bookshelf-content' style={{ width, height }}>
            {[
              './kids_bookshelf_3.jpg',
              './kids_bookshelf_2.jpg',
            ].map(img => <WebpImage key={img} src={require(`${img}`)} alt='Kids Bookshelf' />)
            }</div>
        </ProjectDocument>
        <div className='kids-bookshelf-backside'>
          {[
            './kids_bookshelf_1.jpg',
          ].map((img, i) => <Taped key={img} className='detail-image' tapes={(i % 4 + 1)} type={i === 0 ? EDGE : CORNER}><WebpImage src={require(`${img}`)} alt='Kids Bookshelf Detail' /></Taped>)}
        </div>
      </FlipCard>
    </div>
  );
}
