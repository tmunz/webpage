import React from 'react';
import { ArtworkProps } from './artwork/ArtworkSurface';
import { TmusicArtwork } from './artwork/TmusicArtwork';
import { GoldenSeedsArtwork } from './artwork/GoldenSeedsArtwork';
import { MondrianArtwork } from './artwork/MondrianArtwork';

export function ProjectArtwork({ projectIndex, ...props }: ArtworkProps & { projectIndex: number }) {
  if (projectIndex === 0) return <TmusicArtwork {...props} />;
  if (projectIndex === 1) return <GoldenSeedsArtwork {...props} />;
  return <MondrianArtwork {...props} />;
}
