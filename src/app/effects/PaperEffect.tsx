import React from 'react';

export function PaperEffect({ children, seed = 0 }: { children: React.ReactElement; seed?: string | number }) {
  const filterId = `paper-filter-${seed}`;
  const seedNumber = typeof seed === 'number' ? seed : Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return <>
    <svg style={{ display: 'none' }}>
      <filter id={filterId}>
        <feTurbulence x='0' y='0' baseFrequency='0.01' numOctaves='1' seed={seedNumber} />
        <feDisplacementMap in='SourceGraphic' scale='4' />
      </filter>
    </svg>
    {React.cloneElement(children, {
      ...children.props,
      style: {
        ...children.props.style,
        boxShadow: '2px 3px 20px rgba(0, 0, 0, 0.2), 0 0 50px rgba(148, 88, 29, 0.8) inset',
        background: 'rgb(255, 254, 240)',
        filter: `url(#${filterId})`,
      }
    })}
  </>
}