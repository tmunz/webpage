import './PhotoRow.styl';
import { PhotoEntry } from './PhotoEntry';
import React from 'react';

interface PhotoRowProps {
  photo: any;
  active: boolean;
  onActivate: (active: boolean) => void;
  row: number;
  userAction: boolean;
}

export const PhotoRow = ({ photo, active, onActivate, row, userAction }: PhotoRowProps) => {

  return <tr className='photo-row' key={photo.src} data-src={photo.src}>
    <td className='label'>
      {`[${(row + 1).toString().padStart(3, '0')}]`}<br />
      {photo.name}<br />
      {photo.location}<br />
    </td>
    <td className='image'>
      {photo.src ? (
        <PhotoEntry
          photo={photo}
          active={active}
          onClick={(b) => onActivate(b ? photo.src! : null)}
          userAction={userAction}
        />
      ) : (
        <div className='photo-image-placeholder' />
      )}
    </td>
  </tr>
}