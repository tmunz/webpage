import React, { useEffect, useState } from 'react';
import { MuxProgram } from '../../MuxProgram';
import { MuxOs } from '../../MuxOs';
import { useDimension } from '../../../../utils/useDimension';

export const StandardClockComponent = ({ dateTime }: { dateTime: Date }) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const size = useDimension(elementRef);

  return (
    <div
      className='time-display'
      ref={elementRef}
      style={{ textAlign: 'right', color: 'white', mixBlendMode: 'difference', fontSize: (size?.width ?? 74) / 6.8 }}
    >
      <div className='time'> {dateTime.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })}</div>
      <div className='date'>{dateTime.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}</div>
    </div>
  );
};

export const StandardClock: MuxProgram = {
  name: 'Clock',
  id: 'standard-clock',
  description: 'MuxOs standard clock',
  component: (muxOs: MuxOs) => {
    const [dateTime, setDateTime] = useState<Date>(new Date());
    useEffect(() => {
      const subscription = muxOs.dateTime$.subscribe((newDateTime) => {
        setDateTime(newDateTime);
      });
      return () => subscription.unsubscribe();
    }, []);
    return <StandardClockComponent dateTime={dateTime} />;
  },
  about: <div>MuxOs Standard Clock</div>,
  slots: ['clock'],
  iconPath: require('./standard-clock-icon.png'),
  iconMonoColor: true,
}
