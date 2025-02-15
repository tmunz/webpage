import React, { useMemo } from 'react';
import { ShaderImage } from '../ui/shader-image/ShaderImage';


interface PerspectiveImageProps {
  img: string;
  depthImg: string;
  effectValue?: number;
  position?: { x: number, y: number };
  perspectiveDisabled?: boolean;
  color?: string;
}

export const PerspectiveImage = ({ img, depthImg, effectValue = 0.5, position, color, perspectiveDisabled = false }: PerspectiveImageProps) => {
  const imageUrls = useMemo(() => ({ image: img, depthMap: depthImg }), [img, depthImg]);

  return (
    <ShaderImage
      shaderDisabled={perspectiveDisabled}
      color={color}
      type='three'
      imageUrls={imageUrls}
      uniforms={{
        effectValue: { value: [effectValue, effectValue], type: '2f' },
        position: { value: [position?.x ?? 0, -1 * (position?.y ?? 0)], type: '2f' },
      }}
      fragmentShader={`
        precision mediump float;
        uniform sampler2D image;
        uniform sampler2D depthMap;
        uniform vec2 effectValue;
        uniform vec2 position;
        varying vec2 vUv;

        void main() {
          float depth = texture2D(depthMap, vUv).r; // depthMap is expected to be grayscale, where r = b = g
          vec2 offset = (depth - 0.5) * position * effectValue * 0.1;
          gl_FragColor = texture2D(image, vUv + offset);
        }`
      }
    />
  );
};
