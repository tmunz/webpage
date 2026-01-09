import React, { useState, useEffect } from 'react';
import { MuxProgramConfig, MuxProgramConfigInputType } from './MuxProgram';

export const MuxProgramSettings = ({ config }: { config: MuxProgramConfig }) => {
  const [, forceUpdate] = useState({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;
    const updatedValues = {
      ...config.values,
      [name]: newValue
    };
    config.onChange(updatedValues);
    forceUpdate({});
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '10px', 
      padding: '10px',
      maxHeight: '100%',
      overflow: 'auto'
    }}>
      {config.fields.map((field, index) => {
        const currentValue = config.values[field.name as keyof typeof config.values];
        return (
          <div key={index}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#bbb' }}>
              {field.label}:
              <input
                type={field.type}
                name={field.name}
                value={field.type === MuxProgramConfigInputType.BOOLEAN ? undefined : currentValue as string | number}
                checked={field.type === MuxProgramConfigInputType.BOOLEAN ? currentValue as boolean : undefined}
                onChange={handleInputChange}
                min={field.min}
                max={field.max}
                step={field.step}
                style={{
                  marginTop: '3px',
                  padding: field.type === MuxProgramConfigInputType.COLOR ? '0' : '6px',
                  fontSize: '12px',
                  border: '1px solid #555',
                  borderRadius: '3px',
                  backgroundColor: '#333',
                  color: '#fff',
                  height: field.type === MuxProgramConfigInputType.COLOR ? '32px' : field.type === MuxProgramConfigInputType.BOOLEAN ? '18px' : 'auto',
                  width: field.type === MuxProgramConfigInputType.BOOLEAN ? '18px' : 'auto'
                }}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
};
