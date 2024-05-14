import { lazy } from "react";

export enum IconName {
  FLICKR = 'flickr',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  REBRICKABLE = 'rebrickable',
  LEGO_IDEAS = 'lego-ideas',
  THINGIVERSE = 'thingiverse',
}

export function loadIcon(iconName: IconName) {
  return lazy(async () => {
    return await import(`./assets/${iconName}.svg`);
  });
}