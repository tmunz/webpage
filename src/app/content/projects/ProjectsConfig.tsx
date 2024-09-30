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
    component: <iframe width='100%' height='100%' style={{ boxSizing: 'border-box' }} src='https://tmunz.github.io/Mondrian' />,
    highlight: true,
  },
  {
    name: 'Golden Seeds',
    id: 'gs',
    iconPath: 'https://github.com/tmunz/GoldenSeeds/blob/master/public/icon-256x256.png?raw=true',
    description: 'Web Application to generate SVGs based on mathematical rules.',
    githubLink: 'https://github.com/tmunz/GoldenSeeds',
    component: <iframe width='100%' height='100%' style={{ boxSizing: 'border-box' }} src='https://tmunz.github.io/GoldenSeeds/?name=golden+seeds' />,
    highlight: true,
  },
  {
    name: 'Magic Anagram',
    id: 'magic',
    iconPath: 'https://github.com/tmunz/MagicAnagram/blob/main/favicon.png?raw=true',
    description: 'Animate from a word to an anagram of it.',
    githubLink: 'https://github.com/tmunz/MagicAnagram',
    component: <iframe width='100%' height='100%' style={{ boxSizing: 'border-box' }} src='https://tmunz.github.io/MagicAnagram' />,
    highlight: true,
  },
  {
    name: 'Pebble Alpha Binary',
    id: 'alpha',
    iconPath: 'https://github.com/tmunz/PebbleAlphaBinary/blob/master/alpha_binary_clock/resources/images/pebble-binary-clock-logo.png?raw=true',
    description: 'Binary Watchface for Pebble.',
    githubLink: 'https://github.com/tmunz/PebbleAlphaBinary',
    component: <PebbleAlphaBinary />,
    slots: ['clock'],
  },
  {
    name: 'Volley',
    id: 'volley',
    description: 'XBox Live Indie Game "Volley" by Glassbox Games (released in 2011)',
    component: <iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/8l27WBWPRrU?si=RXYUEHcWNAUhGPYg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
  },
  {
    name: 'Youmigo',
    id: 'youmigo',
    description: 'Award winning Windows Phone App by Glassbox Games - Penpal 2.0',
    component: <div>TODO</div>,
  },
  {
    name: 'Canvacity',
    id: 'canvacity',
    description: 'Concept for the "Tomorrow Talks" contest',
    component: <iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/DGJMyKJZBu8?si=3Ufo-i-X1Vk_o36w" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>,
  },
  {
    name: 'Inlinegraph',
    id: 'ig',
    description: 'jQuery-Library for inline graphs like heatmap, pie, and boolean representation',
    githubLink: 'https://github.com/tmunz/inlinegraph',
    component: <img src="https://raw.githubusercontent.com/tmunz/inlinegraph/master/img/inlinegraph_detail.png" width="100%" />,
  },
];
