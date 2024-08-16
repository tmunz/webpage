import './FlipList.styl';

import React, { ReactNode, useEffect, useRef } from 'react';


interface PortfolioProps {
  items: [ReactNode, ReactNode][];
}

export function FlipList({ items }: PortfolioProps) {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rect = entry.boundingClientRect;
          if (entry.isIntersecting) {
            if (rect.top < window.innerHeight / 2) {
              entry.target.classList.add('entering-top');
              entry.target.classList.remove('entering-bottom');
            } else {
              entry.target.classList.add('entering-bottom');
              entry.target.classList.remove('entering-top');
            }
          } else {
            entry.target.classList.remove('entering-top', 'entering-bottom');
          }
        });
      },
    );

    elementsRef.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      elementsRef.current.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <div className='flip-list'>
      {items.map((item, index) => (
        <div
          key={index}
          className='item-wrapper'
          ref={(el) => (elementsRef.current[index] = el)}
        >
          <div className='item'>
            {item[0]}
            {item[1]}
          </div>
        </div>
      ))}
    </div>
  );
}
