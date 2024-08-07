import React, { useEffect, useRef } from 'react';
import './Portfolio.styl';

interface PortfolioProps {
  items: { img: { srcSet: string, src: string }, title: string, content: string }[];
}

export function Portfolio({ items }: PortfolioProps) {
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
      // { threshold: 0.1 }
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
    <div className='portfolio'>
      {items.map((item, index) => (
        <div
          key={index}
          className='item-wrapper'
          ref={(el) => (elementsRef.current[index] = el)}
        >
          <div className='item'>
            <div className='image-container'>
              <img {...item.img} alt={item.title} />
            </div>
            <div className='text-container'>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
