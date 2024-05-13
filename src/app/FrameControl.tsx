import React from 'react';

import './FrameControl.styl';

export default function FrameControl(props: { onClick?: () => void, active?: boolean }) {

  return (
    <button className={`frame-control ${props.active ? 'active' : ''}`} onClick={props.onClick}>
      <div className="close-img" role="img">
        {['left', 'top', 'right', 'bottom'].map((id) => (<div key={id} className={`close-img-line ${id}`}></div>))}
      </div>
    </button>
  );
}
