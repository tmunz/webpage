import React from 'react';

import './CloseButton.styl';

export default function CloseButton(props: { onClick?: () => void, active?: boolean }) {

  return (
    <button className={`close-button ${props.active ? 'active' : ''}`} onClick={props.onClick}>
      <div className="close-img" role="img">
        {['left', 'top', 'right', 'bottom'].map((id) => (<div key={id} className={`close-img-line ${id}`}></div>))}
      </div>
    </button>
  );
}