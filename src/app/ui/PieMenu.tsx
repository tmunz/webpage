import { arc } from '../utils/SvgPathUtils';
import './PieMenu.styl';
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
        // return (
        //   <div
        //     key={i}
        //     className="pie-menu-option"
        //     style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
        //   >
        //     <svg className="pie-menu-section" viewBox={`-${size / 2} -${size / 2} ${size} ${size}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        //       <path
        //         d={arc(0, 0, r, ir, -angleStep / 2, angleStep / 2)}
        //         fill={colors[i % colors.length]}
        //         opacity={0.5}
        //       />
        //     </svg>
        //     <div className="pie-menu-content" style={{ color: colors[i % colors.length], transform: `translate(-50%, -50%)  translate(${size * (1 + innerCircleRatio) / 4}px) rotate(-${angle}deg)` }}>
        //       {child}
        //     </div>
        //   </div>
        // );
      })}
    </div >
  );
}
