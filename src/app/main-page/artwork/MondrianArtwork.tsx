import React from 'react';
import { ArtworkProps, ArtworkSurface, createArtworkFragmentShader } from './ArtworkSurface';

const fragmentShader = createArtworkFragmentShader(`
  vec3 artwork(vec2 uv) {
    float x1 = 0.28 + 0.09 * sin(uTime * 0.3);
    float x2 = 0.76 + 0.08 * sin(uTime * 0.24 + 1.4);
    float y1 = 0.29 + 0.09 * sin(uTime * 0.35 + 2.0);
    float y2 = 0.73 + 0.08 * sin(uTime * 0.27 + 0.4);
    x1 += uInteraction.x * uInteraction.z * 0.12;
    x2 += uInteraction.x * uInteraction.z * 0.08;
    y1 += uInteraction.y * uInteraction.z * 0.12;
    y2 += uInteraction.y * uInteraction.z * 0.08;
    x1 += uMotion.x * 0.08;
    x2 -= uMotion.x * 0.04;
    y1 += uMotion.y * 0.08;
    y2 -= uMotion.y * 0.04;
    vec3 color = vec3(0.94, 0.93, 0.88);
    if (uv.x < x1 && uv.y > y1) color = vec3(0.86, 0.095, 0.06);
    if (uv.x > x1 && uv.x < x2 && uv.y < y1) color = vec3(0.045, 0.24, 0.69);
    if (uv.x > x2 && uv.y > y2) color = vec3(0.98, 0.74, 0.08);
    if (uv.x > x2 && uv.y < y1) color = vec3(0.04);
    float stroke = max(line(uv.x - x1, 0.012 + uMotion.z * 0.003), line(uv.x - x2, 0.012 + uMotion.z * 0.003));
    stroke = max(stroke, line(uv.y - y1, 0.016 + uMotion.z * 0.003));
    stroke = max(stroke, line(uv.y - y2, 0.016 + uMotion.z * 0.003) * step(x1, uv.x));
    return mix(color, vec3(0.025), stroke);
  }

`);

export function MondrianArtwork(props: ArtworkProps) {
  return <ArtworkSurface {...props} fragmentShader={fragmentShader} />;
}
