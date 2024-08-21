import './ProjectDocument.styl';
import React from 'react';

export function ProjectDocument({ children }: { children?: React.ReactNode }) {
  return (
    <div className="project-document">
      <div className='project-document-container'>
        {['left', 'top', 'right', 'bottom'].map((id) =>
          <div key={id} className={`project-document-border-indicator project-document-border-indicator-${id}`} />
        )}
        <form className='project-document-title-block'>
          <div className="project-document-mainfield"></div>
          <label className='project-document-project'><span>Project</span><input></input></label>
          <label className='project-document-creator'><span>Creator</span><input></input></label>
          <label className='project-document-date-started'><span>Date Started</span><input></input></label>
          <label className='project-document-date-links'><span>Link</span><input></input></label>
          <label className='project-document-date-completed'><span>Date Completed</span><input></input></label>
          <div className="project-document-perspective">
            <svg width="110" height="50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="5" stroke="black" fill="none" />
              <circle cx="25" cy="25" r="10" stroke="black" fill="none" />
              <line x1="25" y1="10" x2="25" y2="40" stroke="black" stroke-dasharray="2" />
              <line x1="10" y1="25" x2="100" y2="25" stroke="black" stroke-dasharray="2" />
              <polygon points="55,20 85,10 85,40 55,30" stroke="black" fill="none" />
            </svg>
          </div>
          <label className='project-document-scale'><span>Scale</span><input></input></label>
          <label className='project-document-material'><span>Material</span><input></input></label>
          <label className='project-document-instructions'><span>Instr.</span><input></input></label>
          <label className='project-document-revision'><span>Rev_No</span><input></input></label>
        </form>
        <div className='project-document-content'>
          {children}
        </div>
      </div>
    </div>
  );
}
