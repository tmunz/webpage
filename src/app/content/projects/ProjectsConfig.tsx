import React from "react";
import { PebbleAlphaBinary } from "./PebbleAlphaBinary";
import { Project } from "./Project";

export const projects: Project[] = [
  {
    name: 'Mondrian',
    id: 'mdrn',
    iconPath: 'https://github.com/tmunz/Mondrian/blob/master/public/icon-256x256.png?raw=true',
    description: 'Web Application to generate Art inspired by Piet Mondrian',
    githubLink: 'https://github.com/tmunz/Mondrian',
    component: <iframe width='100%' height='100%' frameBorder="0" src='https://tmunz.github.io/Mondrian' />,
    highlight: true,
  },
  {
    name: 'Golden Seeds',
    id: 'gs',
    iconPath: 'https://github.com/tmunz/GoldenSeeds/blob/master/public/icon-256x256.png?raw=true',
    description: 'Web Application to generate SVGs based on mathematical rules.',
    githubLink: 'https://github.com/tmunz/GoldenSeeds',
    component: <iframe width='100%' height='100%' frameBorder="0" src='https://tmunz.github.io/GoldenSeeds/?name=golden+seeds' />,
    highlight: true,
  },
  {
    name: 'Magic Anagram',
    id: 'magic',
    iconPath: require('./assets/magic-anagram.png'),
    iconMonoColor: true,
    description: 'Animate from a word to an anagram of it.',
    githubLink: 'https://github.com/tmunz/MagicAnagram',
    component: <iframe width='100%' height='100%' frameBorder="0" src='https://tmunz.github.io/MagicAnagram' />,
    highlight: true,
  },
  {
    name: 'Pebble Alpha Binary',
    id: 'alpha',
    iconPath: require('./assets/pebble-alpha-binary.png'),
    description: 'Binary Watchface for Pebble.',
    githubLink: 'https://github.com/tmunz/PebbleAlphaBinary',
    component: <PebbleAlphaBinary />,
    slots: ['clock'],
  },
  {
    name: 'Volley',
    id: 'volley',
    iconPath: require('./assets/volley.png'),
    description: 'XBox Live Indie Game "Volley" by Glassbox Games (released in 2011)',
    component: <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/8l27WBWPRrU?si=RXYUEHcWNAUhGPYg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
  },
  {
    name: 'Youmigo',
    id: 'youmigo',
    iconPath: require('./assets/youmigo.png'),
    description: 'Award winning Windows Phone 8 App by Glassbox Games - Penpal 2.0',
    component: <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/ha0vTpio0TE?si=BccLYcRUYBog4Kvd" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
  },
  {
    name: 'Canvacity',
    id: 'canvacity',
    iconPath: require('./assets/canvacity.png'),
    iconMonoColor: true,
    description: 'Concept for the "Tomorrow Talks" contest',
    component: <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/DGJMyKJZBu8?si=3Ufo-i-X1Vk_o36w" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
  },
  {
    name: 'Inlinegraph',
    id: 'ig',
    iconPath: 'https://github.com/tmunz/inlinegraph/blob/master/docs/favicon.png?raw=true',
    description: 'jQuery-Library for inline graphs like heatmap, pie, and boolean representation',
    githubLink: 'https://github.com/tmunz/inlinegraph',
    component: <iframe width='100%' height='100%' frameBorder="0" src='https://tmunz.github.io/inlinegraph/' />,
  },
];
