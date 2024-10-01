import React, { useEffect, useState } from 'react';
import { MuxProgram } from '../../MuxProgram';
import { MuxOs } from '../../MuxOs';
import { Observable } from 'rxjs';
import { useDimension } from '../../../../utils/Dimension';

export const StandardClockComponent = ({ dateTime$ }: { dateTime$: Observable<Date> }) => {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const elementRef = React.useRef<HTMLDivElement>(null);

  const size = useDimension(elementRef);

  useEffect(() => {
    const subscription = dateTime$.subscribe((newDateTime) => {
      setDateTime(newDateTime);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dateTime$]);

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
      <div className='date'>{dateTime.toLocaleDateString(
        undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
      )}</div>
    </div>
  );
};

export const StandardClock: MuxProgram = {
  name: 'Clock',
  id: 'standard-clock',
  description: 'standard clock',
  component: (muxOs: MuxOs) => StandardClockComponent({ dateTime$: muxOs.dateTime$ }),
  about: <div>System Standard Clock</div>,
  slots: ['clock'],
  iconPath: require('./standard-clock-icon.png'),
}
