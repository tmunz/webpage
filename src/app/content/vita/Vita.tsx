import React from 'react';
import { SocialLinks } from '../../ui/icon/SocialLinks';
import { Icon } from '../../ui/icon/Icon';
import { IconName } from '../../ui/icon/IconName';
import { professionalLifeData } from './ProfessionalLifeData';
import { Knowledge } from './Knowledge';

import './Vita.styl';


export function Vita() {

  return <div className="vita">
    {/* <div>
      <h2>Tobias Munzert</h2>
      <label>Code Esthete</label>
    </div> */}
    <div>
      <h2>Social Links</h2>
      <SocialLinks />
    </div>
    <div>
      <h2>Professional Life</h2>
      <div className="professional-life">
        <div className="professional-companies">
          {professionalLifeData.map((d) =>
            <div className="professional-life-card" key={d.company} >
              <img className="company-logo" src={require(`./assets/${d.logo}`)} alt={d.company} />
              <div className="company-text">
                <h3 className="company-name">{d.company}</h3>
                <div className="company-role">{d.role}</div>
                <div className="company-date">{d.date}</div>
                <ul className="company-description">
                  {d.tasks.map((task) => <li key={task}>{task}</li>)}
                </ul>
              </div>
            </div>)}
        </div>
      </div>
    </div>
    <div>
      <div>
        <h2>Academic Life</h2>
        <div className="academic-life">
          <div className="academic-icons">
            <Icon className="academic-icon" name={IconName.LMU} />
            <Icon className="academic-icon" name={IconName.AARHUS} />
          </div>
          <div className="academic-text">
            <ul>
              <li>M. Sc. Human Computer Interaction (Media Informatics)</li>
              <li>Nordic Philology</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    {false && <Knowledge />}
  </div >;
}