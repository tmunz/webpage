import './Photo.styl';
import React, { useRef, useEffect, useState } from 'react';
import { CameraViewer } from '../../effects/CameraViewer';
import { CameraViewerFocusing } from '../../effects/CameraViewerFocusing';

const SCROLL_THRESHOLD = 100;

interface Section {
  title: string;
  data: {
    name: string;
    location: string;
    src?: string;
  }[]
};

export function Photo() {

  const { current: allSections } = useRef<Section[]>(
    ['wildlife', 'architecture', 'landscape', 'munich_polaroids']
      .map((section) => ({ ...(require(`./assets/${section}/meta.json`)), rootPath: `./assets/${section}` }))
      .map((section) => ({
        ...section, data: section.data.map((d: any) => ({
          ...d, src: d.src ? require(`${section.rootPath + '/' + d.src}?{sizes:[200, 400, 720, 1200, 2000], format: "webp"}`) : undefined
        }))
      }))
  );

  const { current: mainElement } = useRef<Section & { completlyLoaded?: false }>({
    ...allSections[0],
    data: [allSections[0].data[0]],
    completlyLoaded: false
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(Number.MAX_VALUE);
  const [sections, setSections] = useState<(Section & { completlyLoaded?: boolean })[]>([mainElement]);

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current;
      if (element) {
        setScrollPosition(Math.max(0, element.clientHeight - element.scrollTop * 1.1));
        if (element.scrollTop + element.clientHeight + SCROLL_THRESHOLD >= element.scrollHeight) {
          setSections(prevSections => {
            const c = prevSections.length;
            if (c === 1 && prevSections[0].completlyLoaded === false) {
              return [allSections[0]];
            } else if (c >= allSections.length) {
              return prevSections;
            } else {
              return [...prevSections, allSections[c]];
            }
          });
        }
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
  }, [allSections]);

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
      {sections.map((section, sectionIndex) => (
        <section className='photo-section' key={section.title + sectionIndex}>
          <div className='photo-section-title'>
            <h2 className='photo-section-header-letter'>{section.title}</h2>
            <h3 className='photo-section-header'>{section.title}</h3>
          </div>
          {section.data.map((photo, j) => (
            <div className='photo-image' key={photo.name + j}>
              <label>
                {`[${(j + 1).toString().padStart(3, '0')}]`}<br />
                {photo.name}<br />
                {photo.location}<br />
              </label>
              {photo.src ? (
                // <ShaderImage imageUrls={{ 'image': photo.src }} shaderDisabled={!filter} type={ShaderImageType.NATIVE} />
                <img src={photo.src} />
              ) : (
                <div className='photo-image-placeholder' />
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
