import { lazy } from "react";

export enum IconName {
  PREV = 'prev',
  NEXT = 'next',
  CLI = 'cli',
  LIST = 'list',
  GRID = 'grid',
  
  FLICKR = 'flickr',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  REBRICKABLE = 'rebrickable',
  LEGO_IDEAS = 'lego-ideas',
  THINGIVERSE = 'thingiverse',
  LMU = 'lmu',
  AARHUS = 'aarhus',
}

export function loadIcon(iconName: IconName) {
  return lazy(async () => {
    return await import(`./assets/${iconName}.svg`);
  });
}