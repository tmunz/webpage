import React from 'react';
import { IconName } from '../../ui/icon/IconName';
import { Icon } from '../../ui/icon/Icon';


export function PebbleAlphaBinary() {
  return <div className='pebble-alpha-binary'>
    <h1>Pebble Alpha Binary</h1>
    <p className='info'>
      Binary Watchface for Pebble.
    </p>
    <div>TODO</div>
    <div className="github-link">
      <a href='https://github.com/tmunz/PebbleAlphaBinary' target='_blank' rel='noopener noreferrer'>
        <Icon name={IconName.GITHUB} />
        <label className='tooltip'>Github</label>
      </a>
    </div>
  </div>;
}