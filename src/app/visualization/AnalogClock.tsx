import React from 'react';
import { useDimension } from '../utils/useDimension';

interface Hand {
  color?: string;
  length?: number;
  width?: number;
  counterWeightLength?: number;
}

export interface AnalogClockConfig {
  windowWidth?: number;
  windowHeight?: number;
  backgroundColor?: string;
  clockFaceColor?: string;
  borderColor?: string;
  borderWidth?: number;
  hourHand?: Hand;
  minuteHand?: Hand;
  secondHand?: Hand;
  centerSize?: number;
  centerColor?: string;
  marks?: number;
  markTemplate?: (i: number) => { length: number, width: number, color: string };
  strokeLinecap?: 'butt' | 'round' | 'square';
}

export interface AnalogClockProps extends AnalogClockConfig {
  dateTime: Date;
}

export function AnalogClock({
  dateTime,
  windowWidth,
  windowHeight,
  clockFaceColor = '#ffffff',
  borderColor = '#cccccc',
  borderWidth = 4,
  hourHand = { color: '#000000', length: 0.5, width: 3, counterWeightLength: 0.1 },
  minuteHand = { color: '#000000', length: 0.75, width: 2, counterWeightLength: 0.1 },
  secondHand = { color: '#ff0000', length: 0.9, width: 1, counterWeightLength: 0.1 },
  centerSize = 0.02,
  centerColor = '#ff0000',
  marks = 0,
  markTemplate = (i: number) => ({ length: i % 3 === 0 ? 8 : 4, width: i % 3 === 0 ? 2 : 1, color: '#000000' }),
  strokeLinecap = 'round',
}: AnalogClockProps) {

  const elementRef = React.useRef<HTMLDivElement>(null);
  const size = useDimension(elementRef);
  windowWidth = windowWidth || size?.width || 200;
  windowHeight = windowHeight || size?.height || 200;

  const drawSize = 100;
  const center = { x: drawSize / 2, y: drawSize / 2 }
  const radius = drawSize / 2 - Math.max(0, borderWidth, marks > 0 ? markTemplate(0).length + markTemplate(0).width / 2 : 0);

  const seconds = dateTime.getSeconds();
  const minutes = dateTime.getMinutes();
  const hours = dateTime.getHours() % 12 + minutes / 60;

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = (hours / 12) * 360;

  const polarToCartesian = (angle: number, length: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: center.x + length * Math.cos(rad),
      y: center.y + length * Math.sin(rad),
    };
  };

  const getHandEndpoints = (angle: number, length: number = 0, counterWeight: number = 0) => {
    const end = polarToCartesian(angle, radius * length);
    const counterEnd = polarToCartesian(angle + 180, radius * counterWeight);
    return { end, counterEnd };
  };

  const hourHandPoints = getHandEndpoints(hourAngle, hourHand.length, hourHand.counterWeightLength);
  const minuteHandPoints = getHandEndpoints(minuteAngle, minuteHand.length, minuteHand.counterWeightLength);
  const secondHandPoints = getHandEndpoints(secondAngle, secondHand.length, secondHand.counterWeightLength);

  const renderClockFace = () => (
    <circle
      cx={center.x}
      cy={center.y}
      r={radius}
      fill={clockFaceColor}
      stroke={borderColor}
      strokeWidth={borderWidth}
    />
  );

  const renderMarks = () => (
    Array.from({ length: marks }).map((_, i) => {
      const angle = (i / marks) * 360;
      const mark = markTemplate(i);
      const innerPoint = polarToCartesian(angle, radius);
      const outerPoint = polarToCartesian(angle, radius + mark.length);

      return (
        <line
          key={i}
          x1={innerPoint.x}
          y1={innerPoint.y}
          x2={outerPoint.x}
          y2={outerPoint.y}
          stroke={mark.color}
          strokeWidth={mark.width}
          strokeLinecap="round"
        />
      );
    }));

  const renderHourHand = () => (
    hourHand && <line
      x1={hourHandPoints.counterEnd.x}
      y1={hourHandPoints.counterEnd.y}
      x2={hourHandPoints.end.x}
      y2={hourHandPoints.end.y}
      stroke={hourHand.color}
      strokeWidth={hourHand.width}
      strokeLinecap={strokeLinecap}
    />
  );

  const renderMinuteHand = () => (
    minuteHand && <line
      x1={minuteHandPoints.counterEnd.x}
      y1={minuteHandPoints.counterEnd.y}
      x2={minuteHandPoints.end.x}
      y2={minuteHandPoints.end.y}
      stroke={minuteHand.color}
      strokeWidth={minuteHand.width}
      strokeLinecap={strokeLinecap}
    />
  );

  const renderSecondHand = () => (
    secondHand && <line
      x1={secondHandPoints.counterEnd.x}
      y1={secondHandPoints.counterEnd.y}
      x2={secondHandPoints.end.x}
      y2={secondHandPoints.end.y}
      stroke={secondHand.color}
      strokeWidth={secondHand.width}
      strokeLinecap={strokeLinecap}
    />
  );

  const renderCenter = () => (
    <circle
      cx={center.x}
      cy={center.y}
      r={centerSize * radius}
      fill={centerColor}
    />
  );

  return (
    <div ref={elementRef} style={{ maxWidth: '100%', maxHeight: '100%'}}>
      <svg
        width={windowWidth}
        height={windowHeight}
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid meet'
        style={{ display: 'block' }}
      >
        {renderClockFace()}
        {renderMarks()}
        {renderHourHand()}
        {renderMinuteHand()}
        {renderSecondHand()}
        {renderCenter()}
      </svg>
    </div>
  );
}
