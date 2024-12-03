import React, { CSSProperties } from 'react';

export const WebpImage = ({ src, alt, style = {} }: { src: { src: string, srcSet: string }, alt: string, style?: CSSProperties }) => {

  return (
    <img src={src.src} srcSet={src.srcSet} alt={alt} style={style} draggable={false} />
  );
}
