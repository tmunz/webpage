import React, { useEffect, useRef, useState } from 'react';
import { EiffelTower } from './eiffeltower/EiffelTower';
import { Polaroid } from '../../ui/Polaroid';
import { Mb300sl, Quality } from './mb300sl/Mb300sl';
import { Aircraft } from './Aircraft';

import './Bricks.styl';


export function Bricks() {

  const [scrollRatio, setScrollRatio] = useState(0);
  const [mb300slInView, setMb300slInView] = useState(false);
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
        const mb300SlTriggerPoint = aircraftSection.getBoundingClientRect().bottom;
        if (mb300SlTriggerPoint <= element.scrollTop && !mb300slInView) {
          setMb300slInView(true);
        } else if (element.scrollTop < mb300SlTriggerPoint && mb300slInView) {
          setMb300slInView(false);
        }
      }
    };

    elementRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      elementRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [mb300slInView]);

  return <div className='bricks' ref={elementRef}>
    <section className='polaroid-section'>
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
    <section className='aircraft-section' ref={aircraftRef} style={{ marginTop: size.width / 3 }}>
      <Aircraft width={size.width} scrollRatio={scrollRatio} />
    </section >;
    <section className='mb-300sl-section' style={{ width: size.width, height: size.height, visibility: mb300slInView ? 'visible' : 'hidden' }}>
      <Mb300sl animate={mb300slInView} quality={Quality.PERFORMANCE} />
    </section>
    <section className='placeholder' style={{ background: 'black', height: '2000px' }}></section>
  </div >;
}