import './LoadingBrick.styl';
import React, { useEffect, useState } from 'react';

export const LoadingBrick = ({ dimension = 200, studs = [2, 4], duration = 300 }: { dimension?: number, studs?: [number, number], duration?: number }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setTime(prev => prev + 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const easeInOut = (x: number) => {
    return x < 0.5
      ? 4 * x * x * x
      : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  const calcProgress = (t: number, multiplier = 1, offset = 0) => {
    const quarterDuration = duration / 4;
    const cycle = Math.floor(t / quarterDuration);
    const easedT = easeInOut((t % quarterDuration) / quarterDuration);
    const progress = cycle + easedT;
    return ((offset + progress) * multiplier) % (multiplier * 4);
  }

  const calcColorChannel = (angle: number, range: number) => {
    const v = (angle % 360) / 360 * 2 * range;
    return v < range ? v : 2 * range - v
  };

  const rotationAngle = calcProgress(time, 90, 0.5);
  const brickX = dimension;
  const brickY = brickX / studs[0] * 1.2;
  const brickZ = brickX * studs[1] / studs[0];
  const studHeight = 0.3 / studs[0];

  return (<div className='loading-brick'>
    <div className='brick' style={{ transform: `rotateX(${-10}deg) rotateY(${rotationAngle}deg)rotateZ(${0}deg)` }}>
      {[...Array(4)].map((_, i) => {
        const brickSides = [brickX, brickZ];
        return <div
          key={i}
          className='brick-face'
          style={{
            width: brickSides[i % 2],
            height: brickY,
            background: `rgb(${220 - calcColorChannel(rotationAngle + 45 + i * 90, 200)}, 0, 0)`,
            transform: `translate(-50%, -50%) rotateY(${i * 90}deg) translateZ(${brickSides[(i + 1) % 2] / 2}px)`
          }}
        />;
      })}
      {['brick-face-top', 'brick-studs'].map((c, layer) => <div
        key={c}
        className={`brick-face ${c}`}
        style={{ width: brickX, height: brickZ, transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${brickY * (0.5 + layer * studHeight)}px)` }}
      >
        {[...Array(studs[0] * studs[1])].map((_, i) => <div
          key={i}
          className='brick-stud'
          style={{
            top: `calc(${brickX / studs[0] / 2}px + ${(Math.floor(i / studs[0])) / studs[1] * 100}%)`,
            left: `calc(${brickX / studs[0] / 2}px + ${(Math.floor(i % studs[0])) / studs[0] * 100}%)`,
            width: `${brickX / studs[0]}px`,
            height: `${brickX / studs[0]}px`,
          }}
        >
          <div className='brick-stud-top' />
          {c === 'brick-studs' && <div className='brick-stud-side'
            style={{
              transform: `translate3d(-50%, -50%, ${-brickY * studHeight / 2}px) rotateX(90deg) rotateY(${rotationAngle}deg)`,
              height: `${brickY * studHeight}px`
            }} />}
        </div>
        )}
      </div>
      )}
    </div>
  </div >
  );
};
