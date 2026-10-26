import tmusicImage from './assets/tmusic.png';
import seedsImage from './assets/golden-seeds.png';
import mondrianImage from './assets/mondrian.png';

export const featuredProjects = [
  { name: 'tmusic', repository: 'tmusic', url: 'https://tmunz.github.io/tmusic/', image: String(tmusicImage), description: 'Music, translated into motion.', detail: 'An interactive music visualizer inspired by iconic album artwork.', type: 'Audio visualization', color: '#c6b0ee' },
  { name: 'GoldenSeeds', repository: 'GoldenSeeds', url: 'https://tmunz.github.io/GoldenSeeds/?name=golden+seeds', image: String(seedsImage), description: 'Simple rules. Intricate forms.', detail: 'Mathematical patterns become a playground for parametric design.', type: 'Parametric design', color: '#deb55d' },
  { name: 'Mondrian', repository: 'Mondrian', url: 'https://tmunz.github.io/Mondrian/', image: String(mondrianImage), description: 'Compositions in color and code.', detail: 'A generative exploration of rhythm, balance, and primary colors.', type: 'Generative art', color: '#ee694b' },
];
