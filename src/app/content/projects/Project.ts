import React from 'react';

export interface Project {
  name: string;
  id: string;
  iconPath: string;
  iconMonoColor?: boolean;
  pinned?: boolean;
  description: string;
  githubLink?: string;
  component: React.ReactNode,
  highlight?: boolean;
  slots?: string[];
}