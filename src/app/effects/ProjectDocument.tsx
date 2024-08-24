import './ProjectDocument.styl';
import React from 'react';

interface ProjectDocumentProps {
  titleBlock?: {
    project?: string;
    notes?: string;
    creator?: string;
    dateStarted?: string;
    link?: string;
    dateCompleted?: string;
    dimensions?: string;
    unit?: string;
    material?: string;
    instructions?: boolean;
    revision?: string;
  }
  children?: React.ReactNode;
}

export function ProjectDocument({ titleBlock, children }: ProjectDocumentProps) {
  return (
    <div className="project-document">
      <div className="project-document-container">
        {['left', 'top', 'right', 'bottom'].map((id) => (
          <div key={id} className={`project-document-border-indicator project-document-border-indicator-${id}`} />
        ))}
        <form className="project-document-title-block">
          <div className="project-document-field project-document-notes">
            <label>Notes</label>
            <span className="value">{titleBlock?.notes}</span>
          </div>
          <div className="project-document-field project-document-project">
            <label>Project</label>
            <span className="value">{titleBlock?.project}</span>
          </div>
          <div className="project-document-field project-document-creator">
            <label>Creator</label>
            <span className="value">{titleBlock?.creator}</span>
          </div>
          <div className="project-document-field project-document-date-started">
            <label>Date Started</label>
            <span className="value">{titleBlock?.dateStarted}</span>
          </div>
          <div className="project-document-field project-document-links">
            <label>Link</label>
            <span className="value">{titleBlock?.link}</span>
          </div>
          <div className="project-document-field project-document-date-completed">
            <label>Date Completed</label>
            <span className="value">{titleBlock?.dateCompleted}</span>
          </div>
          <div className="project-document-field project-document-perspective">
            <svg width="110" height="50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="5" stroke="black" fill="none" />
              <circle cx="25" cy="25" r="10" stroke="black" fill="none" />
              <line x1="25" y1="10" x2="25" y2="40" stroke="black" stroke-dasharray="2" />
              <line x1="10" y1="25" x2="100" y2="25" stroke="black" stroke-dasharray="2" />
              <polygon points="55,20 85,10 85,40 55,30" stroke="black" fill="none" />
            </svg>
          </div>
          <div className="project-document-field project-document-dimensions">
            <label>Dimensions</label>
            <span className="value">{titleBlock?.dimensions}</span>
          </div>
          <div className="project-document-field project-document-unit">
            <label>Unit</label>
            <span className="value">{titleBlock?.unit}</span>
          </div>
          <div className="project-document-field project-document-material">
            <label>Material</label>
            <span className="value">{titleBlock?.material}</span>
          </div>
          <div className="project-document-field project-document-instructions">
            <label>Instr.</label>
            <span className="value">{titleBlock?.instructions ? '✔' : '✖'}</span>
          </div>
          <div className="project-document-field project-document-revision">
            <label>Rev_No</label>
            <span className="value">{titleBlock?.revision}</span>
          </div>
        </form>
        <div className="project-document-content">
          {children}
        </div>
      </div>
    </div>
  );
}
