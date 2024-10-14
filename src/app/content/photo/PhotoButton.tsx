import './PhotoButton.styl';
import React from "react";
import { IconName } from "../../ui/icon/IconName";
import { Icon } from "../../ui/icon/Icon";

export const PhotoButton = ({ active, onClick }: { active: boolean, onClick: (active: boolean) => void }) => {

  return <button className={`photo-button ${active ? 'active' : ''}`} onClick={() => onClick(!active)}>
    <div className='photo-button-circle'>
      <Icon name={IconName.PREV} />
      <Icon name={IconName.NEXT} />
    </div>
  </button>;
}