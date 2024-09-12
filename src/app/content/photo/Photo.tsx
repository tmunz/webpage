import './Photo.styl';
import React, { useRef, useEffect, useState } from 'react';
import { CameraViewer } from '../../effects/CameraViewer';
import { CameraViewerFocusing } from '../../effects/CameraViewerFocusing';

export function Photo() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(Number.MAX_VALUE);

  const sections = [
    {
      title: 'Wildlife',
      data: [
        { name: 'Hummingbird', location: 'Mindo', src: null /* background */, lat: -0.0517694, lng: -78.7812344 },
        // TODO replace
        { name: 'Opera House', location: 'Sydney', src: 'sydney', lat: -33.8567799, lng: 151.2127218 },
        { name: 'Estadio Panamericano de Cuba', location: 'Havanna', src: 'havanna', lat: 23.1382214, lng: -82.3669656 },
        { name: 'Arquipélago - Arts Center', location: 'São Miguel', src: 'arquipelago', lat: 37.8185649, lng: -25.6049037 },
        { name: 'Emirates Towers Metro Station', location: 'Dubai', src: 'dubai', lat: 25.2173295, lng: 55.2786327 },
        { name: 'Königsplatz', location: 'München', src: 'muenchen', lat: 48.812245, lng: 8.6475281 },
        { name: 'Arc de Triomphe de l’Étoile', location: 'Paris', src: 'paris', lat: 48.8729441, lng: 2.296929 },
      ]
    },
    {
      title: 'Architecture',
      data: [
        { name: 'Opera House', location: 'Sydney', src: 'sydney', lat: -33.8567799, lng: 151.2127218 },
        { name: 'Estadio Panamericano de Cuba', location: 'Havanna', src: 'havanna', lat: 23.1382214, lng: -82.3669656 },
        { name: 'Arquipélago - Arts Center', location: 'São Miguel', src: 'arquipelago', lat: 37.8185649, lng: -25.6049037 },
        { name: 'Emirates Towers Metro Station', location: 'Dubai', src: 'dubai', lat: 25.2173295, lng: 55.2786327 },
        { name: 'Königsplatz', location: 'München', src: 'muenchen', lat: 48.812245, lng: 8.6475281 },
        { name: 'Arc de Triomphe de l’Étoile', location: 'Paris', src: 'paris', lat: 48.8729441, lng: 2.296929 },
      ]
    },
    {
      title: 'Landscape',
      data: [
        { name: 'That Wanaka Tree', location: 'Wanaka Lake', src: 'wanaka', lat: -44.698579, lng: 169.1148488 },
        { name: 'Shooting star over Joshua Tree', location: 'Joshua Tree National Park', src: 'joshua_tree', lat: 33.9001129, lng: -116.190321 },
        { name: 'Dawn at Umpire Rock', location: 'New York', src: 'new_york', lat: 40.76924, lng: -73.9777389 },
        { name: 'Mount Cook', location: 'New Zealand', src: 'mount_cook', lat: -43.690667, lng: 170.103167 },
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current;
      if (element) {
        setScrollPosition(Math.max(0, element.clientHeight - element.scrollTop * 1.1));
      }
    };

    const scrollContainer = elementRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const convertNumber = (n: number) => {
    return `[${n.toString().padStart(3, '0')}]`;
  }

  return (
    <div
      ref={elementRef}
      className="photo"
      style={{
        backgroundImage: `linear-gradient(transparent ${scrollPosition}px, var(--photoBackgroundColor) ${scrollPosition}px)`
      }}
    >
      <CameraViewer />
      <CameraViewerFocusing />
      {sections.map((section) => (
        <section className='photo-section' key={section.title}>
          <div className='photo-section-title'>
            <h2 className='photo-section-header-letter'>{section.title}</h2>
            <h3 className='photo-section-header'>{section.title}</h3>
          </div>
          {section.data.map((photo, j) =>
          (<div className='photo-image'>
            <label>
              {convertNumber(j + 1)}<br />
              {photo.name}<br />
              {photo.location}<br />
            </label>
            {photo.src
              ? <img src={require(`./assets/${photo.src}.jpg?{sizes:[200, 400, 720, 1200, 2000], format: "webp"}`)} />
              : <div className='photo-image-placeholder' />
            }
          </div>))}
        </section>
      ))}
    </div>
  );
}
