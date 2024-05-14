import React from 'react';

import './Art.styl';

export function Art() {

  const data = [
    { id: '300sl', name: '300 SL' },
    { id: 'dog', name: 'Dog' },
  ];

  return <div className="art">
    {data.map(d => <img key={d.id} src={require(`./assets/${d.id}.jpg`)} alt={d.name} />)}
  </div>;
}