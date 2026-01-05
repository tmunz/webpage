import './IconButton.css';
import React, { HTMLAttributes } from 'react';
import { IconName } from './IconName';
import { Icon } from './Icon';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  name: IconName;
  iconColor?: string;
  href?: string;
}

export const IconButton = ({ name, iconColor = '#000', href, ...args }: Props) => {

  return (
    <button className='icon-button' {...args}>
      <a href={href} target='_blank' rel='noreferrer'>
        {args.children}
        <Icon name={name} fill={iconColor} />
      </a>
    </button>
  );
};
