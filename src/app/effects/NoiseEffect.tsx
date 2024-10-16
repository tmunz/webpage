import React from 'react';

export function NoiseEffect({ children, seed = 0 }: { children: React.ReactElement; seed?: string | number }) {
  const filterId = `noise-filter-${seed}`;
  const seedNumber = typeof seed === 'number' ? seed : Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return <>
    <svg style={{ display: 'none' }}>
      <filter id={filterId}>
        <feTurbulence
          type='fractalNoise'
          baseFrequency='1'
          numOctaves='3'
          stitchTiles='stitch'
          seed={seedNumber}
        />
      </filter>
    </svg>
    {React.cloneElement(children, {
      ...children.props,
      style: {
        ...children.props.style,
        filter: `url(#${filterId})`,
      }
    })}
  </>
}