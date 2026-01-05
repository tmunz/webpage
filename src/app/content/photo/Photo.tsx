import './Photo.css';
import React, { useRef, useEffect, useState } from 'react';
import { CameraViewer } from '../../effects/CameraViewer';
import { CameraViewerFocusing } from '../../effects/CameraViewerFocusing';
import { PhotoMetaData } from '../../ui/photo-gallery/PhotoMetaData';
import { useUserAction } from '../../utils/useUserActions';
import { PhotoRow } from '../../ui/photo-gallery/PhotoRow';

const SCROLL_THRESHOLD = 100;
const SCROLL_OFFSET = 60;
const SWITCH_ACTIVE_PHOTO_DELAY = 400;

interface Section {
  title: string;
  data: PhotoMetaData[]
};

export function Photo() {

  const { current: allSections } = useRef<Section[]>(
    ['wildlife', 'architecture', 'landscape', 'munich_polaroids']
      .map((section) => ({ ...(require(`./assets/${section}/meta.json`)), rootPath: `./assets/${section}` }))
      .map((section) => ({
        ...section, data: section.data.map((d: any) => ({
          ...d, src: d.src ? require(`${section.rootPath + '/' + d.src}?{sizes:[200, 400, 720, 1200, 2000], format: "jpeg"}`) : undefined
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
  const [active, setActive] = useState<string | null>(null)
  const [sections, setSections] = useState<(Section & { completlyLoaded?: boolean })[]>([mainElement]);
  const userAction = useUserAction();

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

  const activatePhoto = (id: string | null) => {
    setActive(current => {
      if (current !== null) {
        setTimeout(() => {
          activatePhoto(id)
        }, SWITCH_ACTIVE_PHOTO_DELAY);
      }
      return current ? null : id;
    });
  };

  useEffect(() => {
    if (active && elementRef.current) {
      const activeElement = elementRef.current.querySelector(`[data-src="${active}"]`);
      if (activeElement instanceof HTMLElement) {
        let offsetTop = activeElement.offsetTop;
        let currentElement = activeElement.offsetParent;

        while (currentElement && currentElement instanceof HTMLElement && currentElement !== elementRef.current) {
          offsetTop += currentElement.offsetTop;
          currentElement = currentElement.offsetParent;
        }

        elementRef.current.scrollTo({
          top: offsetTop - SCROLL_OFFSET,
          behavior: 'smooth',
        });

      }
    }
  }, [active]);


  return (
    <div
      ref={elementRef}
      className="photo"
      style={{
        backgroundImage: `linear-gradient(transparent ${scrollPosition}px, var(--photoBackgroundColor) ${scrollPosition}px)`
      }}
      tabIndex={0}
    >
      <CameraViewer />
      <CameraViewerFocusing />
      {sections.map((section, sectionIndex) => (
        <section className='photo-section' key={section.title + sectionIndex}>
          <header className='photo-section-title'>
            <h3 className='photo-section-header-letter'>{section.title}</h3>
            <h3 className='photo-section-header'>{section.title}</h3>
          </header>
          <table className='photo-section-content'>
            <tbody>
              {section.data.map((photo, rowInSection) => (
                <PhotoRow
                  key={photo.src ?? rowInSection}
                  photo={photo}
                  active={active === photo.src}
                  onActivate={(active) => activatePhoto(active && photo.src ? photo.src : null)}
                  row={rowInSection}
                  userAction={userAction} />
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
