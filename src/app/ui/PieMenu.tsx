import './PieMenu.styl';
import { arc } from '../utils/SvgPathUtils';
import React, { Fragment } from 'react';

interface PieMenuProps {
  children: React.ReactNode;
  size: number;
  innerCircleRatio?: number;
}

export function PieMenu({ children, size, innerCircleRatio = 0.5 }: PieMenuProps) {
  const numOptions = React.Children.count(children);
  const angleStep = 360 / numOptions;
  const r = size / 2;
  const ir = r * innerCircleRatio;

  return (
    <div className="pie-menu" style={{ width: size, height: size }}>
      {React.Children.map(children, (child, i) => {
        const angle = i * angleStep;
        const clipId = `pie-menu-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}-clip`;
        return (
          <Fragment key={i}>
            <svg width={0} height={0}>
              <defs>
                <clipPath id={clipId}>
                  <path d={arc(r, r, r, ir, -angleStep / 2, angleStep / 2)} />
                </clipPath>
              </defs>
            </svg>
            <div
              className="pie-menu-option"
              style={{
                width: size,
                height: size,
                clipPath: `url(#${clipId})`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            >
              <div
                className="pie-menu-content"
                style={{
                  width: size,
                  height: size,
                  transform: `translate(-50%, -50%) translateY(${- (r + ir) / 2}px) rotate(-${angle}deg)`,
                }}
              >
                {child}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div >
  );
}
