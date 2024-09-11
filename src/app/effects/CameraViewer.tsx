import './CameraViewer.styl';
import React, { ReactNode } from "react";

export const CameraViewer = ({ children }: { children?: ReactNode }) => {
  return (
    <div className='camera-viewer'>
      <div className='camera-viewer-overlay'>
        <div className='camera-viewer-left' />
        <div className='camera-viewer-center' />
        <div className='camera-viewer-right' />
      </div>
      {children}
    </div >
  );
}