import React, { useEffect, useState } from 'react';
import { MuxProgram } from '../../MuxProgram';
import { MuxOs } from '../../MuxOs';
import { AnalogClock } from '../../../../visualization/AnalogClock';

export const AnalogClockComponent = ({ dateTime }: { dateTime: Date }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnalogClock dateTime={dateTime} marks={12} />
    </div>
  );
};

export const AnalogClockProgram: MuxProgram = {
  name: 'Analog Clock',
  id: 'analog-clock',
  description: 'Classic analog clock',
  component: (muxOs: MuxOs) => {
    const [dateTime, setDateTime] = useState<Date>(new Date());
    useEffect(() => {
      const subscription = muxOs.dateTime$.subscribe((newDateTime) => {
        setDateTime(newDateTime);
      });
      return () => subscription.unsubscribe();
    }, []);
    return <AnalogClockComponent dateTime={dateTime} />;
  },
  about: <div>Analog Clock</div>,
  slots: ['clock'],
  iconPath: require('../standard-clock/standard-clock-icon.png'),
  iconMonoColor: true,
}
