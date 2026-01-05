import './CameraViewer.css';
import React, { ReactNode } from "react";

export const CameraViewer = ({ children, className }: { children?: ReactNode, className?: string }) => {
  return (
    <div className={`camera-viewer ${className ? className : ''}`}>
      <div className='camera-viewer-overlay'>
        <div className='camera-viewer-left' />
        <div className='camera-viewer-right' />
      </div>
      {children}
    </div >
  );
}