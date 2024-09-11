export enum ObjectFit {
  CONTAIN = 'contain',
  COVER = 'cover',
  FILL = 'fill',
}

export const DEFAULT_IMAGE = 'image';

export const DEFAULT_FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D image;

  void main() {
    gl_FragColor = texture2D(image, vUv);
  }`;

export interface ShaderImageProps {
  imageUrls: Record<string, string>;
  objectFit?: ObjectFit;
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: any
}


export function getScale(scaleRatio: number, objectFit: ObjectFit): { x: number, y: number } {
  switch (objectFit) {
    case ObjectFit.COVER:
      return { x: scaleRatio > 1 ? scaleRatio : 1, y: scaleRatio > 1 ? 1 : 1 / scaleRatio };
    case ObjectFit.CONTAIN:
      return { x: scaleRatio < 1 ? scaleRatio : 1, y: scaleRatio < 1 ? 1 : 1 / scaleRatio };
    default:
      return { x: 1, y: 1 };
  }
}
