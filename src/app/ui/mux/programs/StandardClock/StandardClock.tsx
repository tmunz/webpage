import React, { useEffect, useState } from 'react';
import { MuxProgram } from '../../MuxProgram';
import { MuxOs } from '../../MuxOs';
import { Observable } from 'rxjs';

export const StandardClockComponent = ({ dateTime$ }: { dateTime$: Observable<Date> }) => {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const subscription = dateTime$.subscribe((newDateTime) => {
      setDateTime(newDateTime);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dateTime$]);

  return (
    <div className='time-display' style={{ textAlign: 'right' }}>
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
