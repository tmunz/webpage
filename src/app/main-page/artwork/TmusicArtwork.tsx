import React from 'react';
import { ArtworkProps, ArtworkSurface, createArtworkFragmentShader } from './ArtworkSurface';

const LINE_COUNT = 8;
const LINE_THICKNESS = 0.01;
const LINE_BOTTOM = 0.10;
const LINE_HEIGHT = 0.58;
const SAMPLE_COUNT = 56;
const ANIMATION_SPEED = 1.2;
const ROW_DELAY = 0.32;
const PEAK_SHARPNESS = 2.2;
const PEAK_AMPLITUDE = 0.18;
const MOUSE_AMPLITUDE = 0.16;
const MAX_PEAK_HEIGHT = 0.29;
const NOISE_AMPLITUDE = 0.003;
const MOUSE_NOISE_AMPLITUDE = 0.012;

const fragmentShader = createArtworkFragmentShader(`
  float sampleHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float sampleStrength(float bin, float time) {
    float frame = floor(time);
    float blend = smoothstep(0.0, 1.0, fract(time));
    return mix(sampleHash(vec2(bin, frame)), sampleHash(vec2(bin, frame + 1.0)), blend);
  }

  float sampleProfile(float x, float time) {
    float bin = x * float(${SAMPLE_COUNT});
    float blend = smoothstep(0.0, 1.0, fract(bin));
    return mix(sampleStrength(floor(bin), time), sampleStrength(floor(bin) + 1.0, time), blend);
  }

  vec3 artwork(vec2 uv) {
    vec3 background = vec3(0.025, 0.025, 0.035);
    vec3 color = background;
    // Draw from back to front so each peak hides the lines behind it.
    for (int i = 0; i < ${LINE_COUNT}; i++) {
      float row = float(${LINE_COUNT - 1}) - float(i);
      float x = (uv.x - 0.5) * 2.7;
      float envelope = exp(-pow((x - uInteraction.x * uInteraction.z * 0.6) * 2.2, 2.0));
      // Fixed sample positions change height; delayed rows suggest audio history.
      float sampleTime = uTime * float(${ANIMATION_SPEED}) - row * float(${ROW_DELAY}) + uMotion.z * 0.7;
      float sampleValue = sampleProfile(uv.x, sampleTime);
      float intensity = 0.75 + 0.25 * sin(uTime * float(${ANIMATION_SPEED}) * 0.75 - row * 0.4);
      float peak = pow(sampleValue, float(${PEAK_SHARPNESS})) * envelope * intensity
        * (float(${PEAK_AMPLITUDE}) + uMotion.z * float(${MOUSE_AMPLITUDE}));
      float pointerDistance = (uv.x - 0.5 - uInteraction.x) * 7.0;
      peak *= 1.0 + exp(-pointerDistance * pointerDistance) * uInteraction.z * 0.4;
      peak = min(peak, float(${MAX_PEAK_HEIGHT}));
      float noise = (sampleProfile(uv.x * 2.1, sampleTime + 13.0) - 0.5)
        * (float(${NOISE_AMPLITUDE}) + uMotion.z * float(${MOUSE_NOISE_AMPLITUDE}));
      float y = float(${LINE_BOTTOM}) + row * (float(${LINE_HEIGHT}) / float(${Math.max(1, LINE_COUNT - 1)})) + peak + noise;
      float stroke = line(uv.y - y, float(${LINE_THICKNESS}));
      float edge = smoothstep(0.06, 0.15, uv.x) * smoothstep(0.06, 0.15, 1.0 - uv.x);
      vec3 ink = mix(vec3(0.74, 0.65, 0.95), vec3(0.98), uv.x);
      color = mix(color, background, (1.0 - smoothstep(-0.002, 0.002, uv.y - y)) * edge);
      color += ink * stroke * edge;
    }
    return color;
  }

`);

export function TmusicArtwork(props: ArtworkProps) {
  return <ArtworkSurface {...props} fragmentShader={fragmentShader} />;
}
