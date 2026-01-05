import './PhotoButton.css';
import React from "react";
import { IconName } from "../icon/IconName";
import { Icon } from "../icon/Icon";

export const PhotoButton = ({ active, onClick, userAction }: { active: boolean, onClick: (active: boolean) => void, userAction: boolean }) => {

  return <button className={`photo-button ${active ? 'active' : ''} ${userAction ? 'user-action' : ''}`} onClick={() => onClick(!active)}>
    <div className='photo-button-circle'>
      <Icon name={IconName.PREV} />
      <Icon name={IconName.NEXT} />
    </div>
  </button>;
}