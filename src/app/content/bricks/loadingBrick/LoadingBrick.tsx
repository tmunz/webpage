import React, { useEffect, useState } from 'react';
import { LoadingBrickSvg } from './LoadingBrickSvg';
import { useDimension } from '../../../utils/useDimension';

export const LoadingBrick = ({ studs = [2, 4], duration = 300 }: { studs?: [number, number], duration?: number }) => {
  const [time, setTime] = useState(0);
  const elementRef = React.createRef<HTMLDivElement>();
  const dimension = useDimension(elementRef) ?? { width: 300, height: 300 };
  const size = Math.min(dimension.width * 0.8, dimension.height * 0.8, 500);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setTime(prev => prev + 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const calcProgress = (t: number, steps = 1, step = 1, offset = 0) => {
    const easeInOut = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const stepDuration = duration / steps;
    const cycle = Math.floor(t / stepDuration);
    const easedT = easeInOut((t % stepDuration) / stepDuration);
    const progress = cycle + easedT;
    return ((offset + progress) * step) % (steps * step);
  }

  return (
    <div className='loading-brick' ref={elementRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <LoadingBrickSvg
        width={size}
        height={size}
        xRotation={0.25}
        yRotation={calcProgress(time, 4, Math.PI / 2, Math.PI / 8)}
        light={{ x: -0.7, y: 1, z: 0.7 }}
        minLightIntensity={127}
        studs={studs}
      />
    </div>
  );
};
