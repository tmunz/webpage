import React from "react";

import './Aircraft.styl';


export function Aircraft({ width, scrollRatio }: { width: number, scrollRatio: number }) {

  const brickMultiplier = 1.2;
  const brickX = width * brickMultiplier;
  const brickY = brickX * 0.3;
  const brickZ = brickX * 0.5;
  const scroll = scrollRatio * 1.8;

  return <div className="aircraft">
    <div className='divider-brick' style={{
      width: brickX, height: brickY, transform: `
          translate3d(${50 - (brickMultiplier - 1) / 2 * 100}%, 0, 0) 
          rotateX(${-10 * Math.max(0, 1 - scroll)}deg) 
          rotateY(${45 * Math.max(0, 1 - scroll)}deg)
          rotateZ(${0 * scroll}deg)
        `
    }}>
      <div
        className='brick-face brick-face-front'
        style={{
          width: brickX,
          height: brickY,
          transform: `translate(-50%, -50%) rotateY(0deg) translateZ(${brickZ * 0.5}px)`,
          padding: `${brickX / 8}px`,
          fontSize: `${brickX / 30}px`,
          boxSizing: 'border-box',
        }}
      >
        Ultimate Air- & Spacecraft Collection
      </div>
      <div
        className='brick-face brick-face-left'
        style={{ width: brickZ, height: brickY, transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${brickX * 0.5}px)` }}
      />
      {['brick-face-top', 'brick-studs'].map((t, layer) => <div
        className={`brick-face ${t}`}
        style={{ width: brickX, height: brickZ, transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${brickY * (0.5 + layer * 0.1)}px)` }}
      >
        {[...Array(8)].map((_, i) => <div
          key={i}
          className='brick-stud'
          style={{
            top: `${(1 / 4 + 1 / 2 * Math.floor(i / 4)) * 100}%`,
            left: `${(1 / 8 + (i % 4) * 1 / 4) * 100}%`,
            width: `${brickX / 4}px`,
            height: `${brickZ / 2}px`,
          }}
        >
          <div className='brick-stud-top' />
          {t === 'brick-studs' && <div className='brick-stud-side'
            style={{
              transform: `translate3d(-50%, -50%, ${-brickY * 0.1 / 2}px) rotateX(90deg) rotateY(${45 * Math.max(0, 1 - scroll)}deg)`,
              height: `${brickY * 0.1}px`
            }} />}
        </div>
        )}
      </div>
      )}
    </div>
    <div className='aircraft-content' style={{ paddingTop: '300px' }}>
      <div className='aircraft-images'>
        {[...Array(3)].map((_, i) => <img key={i} className='aircraft-image' src={require(`./assets/aircraft_${i}.jpg`)} />)}
      </div>
    </div>
  </div >;
}