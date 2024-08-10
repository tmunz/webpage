export interface ProfessionalLifeData {
  company: string,
  role: string,
  date: string, // TODO?
  tasks: string[],
  logo: string,
}

export const professionalLifeData: ProfessionalLifeData[] = [
  {
    company: 'Smartify IT',
    role: 'Senior Software Engineer',
    date: 'June 2018 to Date',
    tasks: ['Angular and Spring Boot Development', 'Data Integration and Datawarehouse Development', 'Team Lead'],
    logo: 'smartifyit.png',
  }, {
    company: 'WMC Healthcare',
    role: 'Software Engineer',
    date: 'September 2016 to May 2018',
    tasks: ['React and JavaEE Development', 'Data Integration (Pentaho)'],
    logo: 'wmc_healthcare.png',
  }, {
    company: 'Mindogo',
    role: 'Working Student',
    date: 'April 2015 to June 2016',
    tasks: ['iOS Development and Conception (i.a. Krautreporter)', 'Android Development (i.a. Wear-App for a large insurance company)'],
    logo: 'mindogo.png',
  }, {
    company: 'Electric Artcube',
    role: 'Working Student',
    date: 'February 2014 to August 2014',
    tasks: ['Web-Development with Magento (php)', 'Design'],
    logo: 'electric_artcube.png',
  }, {
    company: 'Experteer (Emplido)',
    role: 'Working Student',
    date: 'September 2011 to November 2013',
    tasks: ['Web-Development, Front- and Backend (Apache Wicket)', 'Design'],
    logo: 'emplido.png',
  }, {
    company: 'Glassbox Games',
    role: 'Cofounder',
    date: 'May 2011 to September 2016',
    tasks: ['xBox Game Development for abstract volleyball game (mainly graphics)', 'Graphics and Software Development for multiple award winnig Windows Phone Apps'],
    logo: 'glassbox_games.png'
  }, {
    company: 'Ludwig Maximilian University of Munich',
    role: 'Working Student',
    date: 'April 2011 to February 2014 (not continuously)',
    tasks: ['Tutor for Digital Media', 'Tutor for Algorithms and Data Structures', 'Assistant at the Institute for Communication Studies and Media Research'],
    logo: 'lmu.png'
  },
];