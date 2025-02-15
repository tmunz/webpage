export type ObjectFit = 'contain' | 'cover' | 'fill';

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


export function getScale(
  texture: { width: number; height: number },
  container: { width: number; height: number },
  objectFit: ObjectFit
): { x: number; y: number } {
  const scaleX = container.width / texture.width;
  const scaleY = container.height / texture.height;

  switch (objectFit) {
    case 'cover': {
      const scale = Math.max(scaleX, scaleY);
      return { x: scale, y: scale };
    }
    case 'contain': {
      const scale = Math.min(scaleX, scaleY);
      return { x: scale, y: scale };
    }
    case 'fill': {
      return { x: scaleX, y: scaleY };
    }
    default:
      return { x: 1, y: 1 };
  }
}
