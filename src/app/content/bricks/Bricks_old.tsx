import './Bricks.styl';

import React, { useEffect, useRef, useState } from 'react';
import { EiffelTower } from './eiffeltower/EiffelTower';
import { Polaroid } from '../../effects/Polaroid';
import { CarShow } from '../../three/car-show/CarShow';
import { Aircraft } from './aircraft/Aircraft';
import { Mb300Ssl } from './mb300sl/Mb300sl';
import { useDimension } from '../../utils/Dimension';


export function Bricks() {

  const [scrollRatio, setScrollRatio] = useState(0);
  const [mb300slInView, setMb300slInView] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);
  const aircraftRef = useRef<HTMLDivElement>(null);

  const dimension = useDimension(elementRef) ?? { width: 0, height: 0 };


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
        <img src={require('./flowers/flowers.jpg')} />
        <div>Get instuctions for free on Rebrickable</div>
      </Polaroid>
      <Polaroid className='eiffel-polaroid' caption='Paris'>
        <div className='eiffel-polaroid-content'>
          <img src={require('./eiffeltower/eiffel_tower_scene.jpg')} />
          <EiffelTower />
        </div>
        <div>My first LEGO Ideas Project</div>
      </Polaroid>
    </section>
    <section className='aircraft-section' ref={aircraftRef} style={{ marginTop: dimension.width / 3 }}>
      <Aircraft width={dimension.width} scrollRatio={scrollRatio} />
    </section >;
    <section className='mb-300sl-section' style={{ width: dimension.width, height: dimension.height, visibility: mb300slInView ? 'visible' : 'hidden' }}>
      <CarShow Model={Mb300Ssl} animate={mb300slInView} />
    </section>
    <section className='placeholder' style={{ background: 'black', height: '2000px' }}></section>
  </div >;
}