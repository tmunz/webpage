import React, { useEffect, useState } from 'react';
import { AlphaBinaryClock, AlphaBinaryClockConfig, DEFAULT_CONFIG } from '../../visualization/AlphaBinaryClock';
import { MuxProgramConfig, MuxProgramConfigInputType } from '../../ui/mux/MuxProgram';
import { MuxOs } from '../../ui/mux/MuxOs';

let config = DEFAULT_CONFIG;
const configListeners: Array<(config: AlphaBinaryClockConfig) => void> = [];

const updateSharedConfig = (newConfig: AlphaBinaryClockConfig) => {
  config = newConfig;
  configListeners.forEach(listener => listener(config));
};

const subscribeToConfig = (listener: (config: AlphaBinaryClockConfig) => void) => {
  configListeners.push(listener);
  return () => {
    const index = configListeners.indexOf(listener);
    if (index > -1) configListeners.splice(index, 1);
  };
};

export function PebbleAlphaBinaryContent(muxOs: MuxOs) {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const dateSubscription = muxOs.dateTime$.subscribe((newDateTime) => {
      setDateTime(newDateTime);
    });

    return () => {
      dateSubscription.unsubscribe();
    };
  }, []);

  return <AlphaBinaryClock {...config} dateTime={dateTime} />;
}

export const PebbleAlphaBinarySettings: MuxProgramConfig<AlphaBinaryClockConfig> = {
  get values() {
    return config;
  },
  onChange: (newValues) => {
    updateSharedConfig(newValues);
  },
  subscribe: (listener) => subscribeToConfig(listener),
  fields: [
    { label: 'window width', type: MuxProgramConfigInputType.NUMBER, name: 'windowWidth' },
    { label: 'window height', type: MuxProgramConfigInputType.NUMBER, name: 'windowHeight' },
    { label: 'window padding', type: MuxProgramConfigInputType.NUMBER, name: 'windowPadding'},
    { label: 'corner radius', type: MuxProgramConfigInputType.NUMBER, name: 'relativeCornerRadius', min: 0, max: 1, step: 0.1 },
    { label: 'border width', type: MuxProgramConfigInputType.NUMBER, name: 'borderWidth' },
    { label: 'border padding', type: MuxProgramConfigInputType.NUMBER, name: 'borderPadding' },
    { label: 'vertical space', type: MuxProgramConfigInputType.NUMBER, name: 'verticalSpace' },
    { label: 'horizontal space', type: MuxProgramConfigInputType.NUMBER, name: 'horizontalSpace' },
    { label: 'fill color', type: MuxProgramConfigInputType.COLOR, name: 'fillColor' },
    { label: 'border color', type: MuxProgramConfigInputType.COLOR, name: 'borderColor' },
    { label: 'background color', type: MuxProgramConfigInputType.COLOR, name: 'backgroundColor' },
    { label: 'has border', type: MuxProgramConfigInputType.BOOLEAN, name: 'hasBorder'},
    { label: 'is border date', type: MuxProgramConfigInputType.BOOLEAN, name: 'isBorderDate' },
    { label: 'is 24h style', type: MuxProgramConfigInputType.BOOLEAN, name: 'is24hStyle' }
  ]
};
