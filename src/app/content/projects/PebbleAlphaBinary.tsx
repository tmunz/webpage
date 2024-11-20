import './PebbleAlphaBinary.styl';

import React, { useEffect, useState } from 'react';
import { AlphaBinaryClock, AlphaBinaryClockConfig } from '../../visualization/AlphaBinaryClock';


export function PebbleAlphaBinary() {
  const [config, setConfig] = useState<AlphaBinaryClockConfig>({
    windowWidth: 144,
    windowHeight: 168,
    windowPadding: 2,
    backgroundColor: '#000000',
    fillColor: '#ff7403',
    borderColor: '#d3d3d3',
    relativeCornerRadius: 0.5,
    borderWidth: 2,
    borderPadding: 1,
    verticalSpace: 3,
    horizontalSpace: 10,
    hasBorder: true,
    isBorderDate: true,
    is24hStyle: true,
  });

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  enum InputType { NUMBER = 'number', BOOLEAN = 'checkbox', COLOR = 'color' };

  const inputConfig = [
    { label: 'window width', type: InputType.NUMBER, name: 'windowWidth', value: config.windowWidth },
    { label: 'window height', type: InputType.NUMBER, name: 'windowHeight', value: config.windowHeight },
    { label: 'window padding', type: InputType.NUMBER, name: 'windowPadding', value: config.windowPadding },
    { label: 'corner radius', type: InputType.NUMBER, name: 'relativeCornerRadius', value: config.relativeCornerRadius },
    { label: 'border width', type: InputType.NUMBER, name: 'borderWidth', value: config.borderWidth },
    { label: 'border padding', type: InputType.NUMBER, name: 'borderPadding', value: config.borderPadding },
    { label: 'vertical space', type: InputType.NUMBER, name: 'verticalSpace', value: config.verticalSpace },
    { label: 'horizontal space', type: InputType.NUMBER, name: 'horizontalSpace', value: config.horizontalSpace },
    { label: 'fill color', type: InputType.COLOR, name: 'fillColor', value: config.fillColor },
    { label: 'border color', type: InputType.COLOR, name: 'borderColor', value: config.borderColor },
    { label: 'background dark', type: InputType.COLOR, name: 'backgroundColor', value: config.backgroundColor },
    { label: 'has border', type: InputType.BOOLEAN, name: 'hasBorder', value: config.hasBorder },
    { label: 'is border date', type: InputType.BOOLEAN, name: 'isBorderDate', value: config.isBorderDate },
    { label: 'is 24h style', type: InputType.BOOLEAN, name: 'is24hStyle', value: config.is24hStyle }
  ];


  return (
    <div className='pebble-alpha-binary'>
      <AlphaBinaryClock {...config} dateTime={dateTime} />
      <div className='configurations'>
        {inputConfig.map((input, index) => (
          <div key={index}>
            <label>
              {input.label}:
              <input
                type={input.type}
                name={input.name}
                value={input.value === InputType.BOOLEAN ? undefined : input.value as string | number}
                checked={input.type === InputType.BOOLEAN ? input.value as boolean : undefined}
                onChange={handleInputChange}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
