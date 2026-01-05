import './ChristmasTree.css';
import React from 'react';
import { ProjectDocument } from '../../../effects/ProjectDocument';
import { WebpImage } from '../../../ui/WebpImage';
import { useDinA } from '../../../utils/useDinA';

export function ChristmasTree(props: { width: number, height: number }) {

  const GAP = 20;
  const { width, height } = useDinA(props.width - GAP, props.height - GAP);

  return (
    <div className={`christmas-tree`}>
      <ProjectDocument
        checkered
        titleBlock={{
          project: 'Treeless Christmas Tree',
          notes: '',
          creator: 'Tobias Munzert',
          link: <a href='https://www.thingiverse.com/thing:6853276' target='_blank'>thing:6853276</a>,
          dateStarted: '2018-03-20',
          dateCompleted: '2018-11-27',
          dimensions: '⌀ 100',
          unit: 'cm',
          material: '6mm poplar Plywood, Toothpicks, Nylon Cord, Shoelaces',
          instructions: true,
          revision: '1.1'
        }}
      >
        <div className='christmas-tree-content' style={{ width, height }}>
          {[
            './christmas_tree_1.jpg',
            './christmas_tree_2.png',
          ].map(img => <WebpImage key={img} src={require(`${img}`)} alt='Treeless Christmas Tree Construction Drawing' />)
          }</div>
      </ProjectDocument>
    </div>
  );
}
