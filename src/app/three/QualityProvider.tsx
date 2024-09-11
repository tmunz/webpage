import { createContext, ReactElement, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import React from 'react';

export enum Quality {
  PERFORMANCE = 0,
  LOW = 1,
  MIDDLE = 3,
  HIGH = 5,
}

export const QualityContext = createContext<Quality>(Quality.HIGH);

export const AutoQuality = ({ children, forceQuality }: { children: ReactElement, forceQuality?: Quality }) => {
  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());
  const [quality, setQuality] = useState(Quality.HIGH);

  const fpsToQuality = (fps: number) => {
    if (fps >= 24) {
      return Quality.HIGH;
    } else if (fps >= 12) {
      return Quality.MIDDLE;
    } else if (fps >= 6) {
      return Quality.LOW;
    } else {
      return Quality.PERFORMANCE;
    }
  };

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const delta = now - lastTime.current;

    if (delta >= 1000) {
      const fps = (frameCount.current / delta) * 1000;
      setQuality(forceQuality !== undefined ? forceQuality : fpsToQuality(fps));
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return <QualityContext.Provider value={quality}>{children}</QualityContext.Provider>;
};