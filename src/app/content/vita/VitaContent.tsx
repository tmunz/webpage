import './VitaContent.css';

import React from 'react';
import { SocialLinks } from '../../ui/icon/SocialLinks';
import { Icon } from '../../ui/icon/Icon';
import { IconName } from '../../ui/icon/IconName';
import { professionalLifeData } from './ProfessionalLifeData';


export function VitaContent() {

  return <div className='vita-content'>
    <div>
      <h2>Social Links</h2>
      <SocialLinks />
    </div>
    <div className='professional-life'>
      <h2>Professional Life</h2>
      <div className='professional-companies'>
        {professionalLifeData.map((d) =>
          <div className='professional-life-card' key={d.company} >
            <img className='company-logo' src={require(`./company-logos/${d.logo}`)} alt={d.company} />
            <div className='company-text'>
              <h3 className='company-name'>{d.company}</h3>
              <div className='company-role'>{d.role}</div>
              <div className='company-date'>{d.date}</div>
              <ul className='company-description'>
                {d.tasks.map((task) => <li key={task}>{task}</li>)}
              </ul>
            </div>
          </div>)}
      </div>
    </div>
    <div>
      <h2>Academic Life</h2>
      <div className='academic-life'>
        <div className='academic-icons'>
          <Icon className='academic-icon' name={IconName.LMU} />
          <Icon className='academic-icon' name={IconName.AARHUS} />
        </div>
        <div className='academic-text'>
          <ul>
            <li>M. Sc. Human Computer Interaction (Media Informatics)</li>
            <li>Nordic Philology</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2>Membership</h2>
      <ul>
        <li><a href='https://munichmakerlab.de/' target='_blank'>Munich Maker Lab</a></li>
        <li><a href='https://www.sv-fischbach1949.de/' target='_blank'>SV Fischbach</a></li>
      </ul>
    </div>
    <div className='imprint'>
      <h2>Imprint</h2>
      <div className='imprint-content'>
        <span>Tobias Munzert</span>
        <span>Theresienstraße 160</span>
        <span>München 80333</span>
      </div>
    </div>
  </div>;
}