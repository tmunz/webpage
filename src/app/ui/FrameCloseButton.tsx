import './FrameCloseButton.css';

import React from 'react';


export default function FrameCloseButton(props: { onClick?: () => void, active?: boolean, className?: string }) {

  return (
    <button className={`frame-close-button ${props.active ? 'active' : ''} ${props.className ? props.className : ''}`} onClick={props.onClick}>
      <div className="close-img" role="img">
        {['left', 'top', 'right', 'bottom'].map((id) => (<div key={id} className={`close-img-line ${id}`}></div>))}
      </div>
    </button>
  );
}
