import React from "react";
import { PebbleAlphaBinary } from "./PebbleAlphaBinary";

export const projects = [
  {
    name: 'Mondrian',
    id: 'mdrn',
    description: 'Web Application to generate Art inspired by Piet Mondrian',
    githubLink: 'https://github.com/tmunz/Mondrian',
    component: <iframe width='100%' height='100%' src='https://tmunz.github.io/Mondrian' />,
  },
  {
    name: 'Golden Seeds',
    id: 'gs',
    description: 'Web Application to generate SVGs based on mathematical rules.',
    githubLink: 'https://github.com/tmunz/GoldenSeeds',
    component: <iframe width='100%' height='100%' src='https://tmunz.github.io/GoldenSeeds/?name=golden+seeds' />,
  },
  {
    name: 'Magic Anagram',
    id: 'magic',
    description: 'Animate from a word to an anagram of it.',
    githubLink: 'https://github.com/tmunz/MagicAnagram',
    component: <iframe width='100%' height='100%' src='https://tmunz.github.io/MagicAnagram/' />,
  },
  {
    name: 'Pebble Alpha Binary',
    id: 'alpha',
    description: 'Binary Watchface for Pebble.',
    githubLink: 'https://github.com/tmunz/PebbleAlphaBinary',
    component: <PebbleAlphaBinary />,
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
