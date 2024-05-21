import React from 'react';
import { SocialLinks } from '../../icon/SocialLinks';
import { Icon } from '../../icon/Icon';
import { IconName } from '../../icon/IconName';
import { Knowledge } from './Knowledge';

import './Vita.styl';



export function Vita() {

  const professionalLife = [
    {
      company: 'Smartify IT',
      position: 'Senior Software Engineer',
      date: 'June 2018 to Date',
      tasks: ['Angular and Spring Boot Development', 'Data Integration and Datawarehouse Development', 'Team Lead'],
      logo: 'smartifyit.png',
    },
    {
      company: 'WMC Healthcare',
      position: 'Software Engineer',
      date: 'September 2016 to Mai 2018',
      tasks: ['React and JavaEE Development', 'Data Integration (Pentaho)'],
      logo: 'wmc_healthcare.png',
    },
    {
      company: 'Mindogo',
      position: 'Working Student',
      date: 'April 2015 to June 2016',
      tasks: ['iOS Development and Conception (i.a. Krautreporter)', 'Android Development (i.a. Wear-App for a large insurance company)'],
      logo: 'mindogo.png',
    },
    {
      company: 'Electric Artcube',
      position: 'Working Student',
      date: 'February 2014 to August 2014',
      tasks: ['Web-Development with Magento (php)', 'Design'],
      logo: 'electric_artcube.png',
    },
    {
      company: 'Experteer (Emplido)',
      position: 'Working Student',
      date: 'September 2011 to November 2013',
      tasks: ['Web-Development, Front- and Backend (Java)', 'Design'],
      logo: 'emplido.png',
    },
    {
      company: 'Glassbox Games',
      position: 'Cofounder',
      date: 'May 2011 to September 2016',
      tasks: ['xBox Game Development for abstract volleyball game (mainly graphics)', 'Graphics and Software Development for multiple award winnig Windows Phone Apps'],
      logo: 'glassbox_games.png'
    }, {
      company: 'Ludwig Maximilian University of Munich',
      position: 'Working Student',
      date: 'April 2011 to February 2014 (not continuously)',
      tasks: ['Tutor for Digital Media', 'Tutor for Algorithms and Data Structures', 'Assistant at the Institute for Communication Studies and Media Research'],
      logo: 'lmu.png'
    },
  ]

  return <div className="vita">
    <div className="header">
      <div>
        <h1>Tobias Munzert</h1>
        <label>Code Esthete</label>
      </div>
      <SocialLinks />
    </div>
    <div className="life">
      <div>
        <h1>Professional Life</h1>
        <div className="professional-life">
          <div className="professional-companies">
            {professionalLife.map((d) =>
              <div key={d.company} >
                <img className="company-logo" src={require(`./assets/${d.logo}`)} alt={d.company} />
                <div className="company-text">
                  <div>{d.company}</div>
                  <div>{d.position}</div>
                  <div>{d.date}</div>
                  <ul>
                    {d.tasks.map((task) => <li key={task}>{task}</li>)}
                  </ul>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      <Knowledge />
      <div>
        <div>
          <h1>Academic Life</h1>
          <div className="academic-life">
            <div className="academic-icons">
              <Icon name={IconName.LMU} />
              <Icon name={IconName.AARHUS} />
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
    </div>
  </div >;
}