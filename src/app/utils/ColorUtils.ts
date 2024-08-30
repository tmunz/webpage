import { Color } from "three";

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const getRandomColor = (colors: string[]) => {
  const col = hexToRgb(colors[Math.floor(Math.random() * colors.length)]);
  return new Color(`rgb(${col?.r},${col?.g},${col?.b})`);
};