import './AircraftContent.styl';
import React from 'react';


export const AircraftContent = () => {
  return <>
    <div className='aircraft-content bricks-content'>
      <div className='aircraft-grid'>
        <h2>Ultimate Air- & Spacecraft Collection</h2>
        {[...Array(3)].map((_, i) => <img key={i} className='aircraft-image' src={require(`./aircraft_${i}.jpg`)} />)}
      </div>
    </div >
  </>;
}