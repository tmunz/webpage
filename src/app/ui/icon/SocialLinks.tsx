import React from 'react';


import './SocialLinks.styl';
import { Icon } from './Icon';
import { IconName } from './IconName';

export function SocialLinks() {

  const data = [
    { name: IconName.GITHUB, title: 'Github', link: 'https://github.com/tmunz' },
    { name: IconName.INSTAGRAM, title: 'Instagram', link: 'https://www.instagram.com/tobiasmunzert' },
    { name: IconName.YOUTUBE, title: 'Youtube', link: 'https://www.youtube.com/channel/UC5fa0Gjo_6ddlNEpQ2gRjoA' },
    { name: IconName.REBRICKABLE, title: 'Rebrickable', link: 'https://rebrickable.com/users/tmunz/mocs/' },
    { name: IconName.LEGO_IDEAS, title: 'Lego Ideas', link: 'https://ideas.lego.com/profile/3e194015-f5c0-46e1-b14b-275d593dc998' },
    { name: IconName.FLICKR, title: 'Flickr', link: 'https://www.flickr.com/photos/101562535@N03/' },
    // {id: 'thingiverse', title: 'Thingiverse', link: ''},
    // {id: 'buildamoc', title: 'Builda MOC', link: 'https://buildamoc.com/products/flower-selection'}, 
    // linkedin
  ];

  return (
    <ul className="social-links">
      {data.map((d) => (
        <li key={d.name}>
          <a href={d.link} target="_blank" rel="noopener noreferrer">
            <Icon name={d.name} />
            <label className="tooltip">{d.title}</label>
          </a>
        </li>
      ))}
    </ul>
  );
}