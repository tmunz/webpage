import React, { useEffect, useRef, useState } from 'react';
import { EiffelTower } from './EiffelTower';
import { Polaroid } from '../../ui/Polaroid';

import './Bricks.styl';
import { Mb300sl } from './Mb300sl';


export function Bricks() {

  const [scrollRatio, setScrollRatio] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const elementRef = useRef<HTMLDivElement>(null);
  const aircraftRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target instanceof HTMLDivElement) {
          const width = Math.floor(entry.target.offsetWidth);
          const height = Math.floor(entry.target.offsetHeight);

          setSize({ width, height });
        }
      }
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const aircraftSection = aircraftRef.current;
      const element = elementRef.current;
      if (aircraftSection && element) {
        setScrollRatio(element.scrollTop / aircraftSection.offsetTop);
      }
    };

    elementRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      elementRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getAircraftSection = () => {
    const brickMultiplier = 1.2;
    const brickX = size.width * brickMultiplier;
    const brickY = brickX * 0.3;
    const brickZ = brickX * 0.5; 
    const scroll = scrollRatio * 1.8;

    return <section className='aircraft' ref={aircraftRef} style={{ marginTop: size.width / 3 }}>
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
    </section >;
  }


  return <div className='bricks' ref={elementRef}>
    <section className='polaroids'>
      <Polaroid className='flower-polaroid' caption='Flowers'>
        <img src={require('./assets/flowers.jpg')} />
        <div>Get instuctions for free on Rebrickable</div>
      </Polaroid>
      <Polaroid className='eiffel-polaroid' caption='Paris'>
        <div className='eiffel-polaroid-content'>
          <img src={require('./assets/eiffel_tower_scene.jpg')} />
          <EiffelTower />
        </div>
        <div>My first LEGO Ideas Project</div>
      </Polaroid>
    </section>
    {getAircraftSection()}
    <section className='mb-300sl' style={{ width: size.width, height: size.height, visibility: scrollRatio < 1 ? 'hidden' : 'visible' }}>
      <Mb300sl />
    </section>
    <section className='placeholder' style={{ background: 'black', height: '2000px' }}></section>
  </div >;
}