import React, { useEffect, useState } from 'react';
import { NetworkGraph, NetworkLink, NetworkNode } from '../../visualization/NetworkGraph';
import { StipplingService } from '../../visualization/StipplingService';

export function Knowledge() {

  const [active, setActive] = useState<boolean>(false);

  const size = 800;

  const nodeData = [
    { id: 'root', name: 'me' },
    { id: 'java', name: 'Java' },
    { id: 'spring', name: 'Spring Boot' },
    { id: 'ee', name: 'Java EE' },
    { id: 'csharp', name: 'C#' },
    { id: 'windowsphone', name: 'Windows Phone' },
    { id: 'xbox', name: 'xBox' },
    { id: 'app', name: 'Mobile App' },
    { id: 'ios', name: 'iOS' },
    { id: 'swift', name: 'Swift' },
    { id: 'android', name: 'Android' },
    { id: 'wear', name: 'Android Wear' },
    { id: 'web', name: 'Web' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'js', name: 'Javascript' },
    { id: 'ts', name: 'Typescript' },
    { id: 'angular', name: 'Angular' },
    { id: 'react', name: 'React' },
    { id: 'd3', name: 'D3' },
    { id: 'py', name: 'python' },
    { id: 'django', name: 'Django' },
    { id: 'pandas', name: 'Pandas' },
    { id: 'jupyter', name: 'Jupyter' },
    { id: 'rpa', name: 'RPA' },
    { id: 'db', name: 'Database' },
    { id: 'sql', name: 'SQL' },
    { id: 'pg', name: 'PostgreSQL' },
    { id: 'mongo', name: 'MongoDB' },
    { id: 'hibernate', name: 'Hibernate' },
    { id: 'mode', name: 'Work Mode' },
    { id: 'devops', name: 'DevOps' },
    { id: 'scrum', name: 'Scrum' },
    { id: 'agile', name: 'Agile' },
    { id: 'kanban', name: 'Kanban' },
    { id: 'cloud' },
    { id: 'aws', name: 'AWS' },
    { id: 'azure', name: 'Azure' },
    { id: 'k8s', name: 'Kubernetes' },
    { id: 'minikube', name: 'Minikube' },
    { id: 'tools', name: 'Tools' },
    { id: 'git', name: 'Git' },
    { id: 'docker', name: 'Docker' },
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'gitlab', name: 'Gitlab' },
    { id: 'tableau', name: 'Tableau' },
    { id: 'datawarehouse', name: 'Datawarehouse / Data Integration' },
    { id: 'pentaho', name: 'Pentaho' },
    { id: 'talend', name: 'Talend Open Studio' },
    { id: 'minio', name: 'Minio' },
    { id: 's3', name: 'S3' },
    { id: 'excel', name: 'Excel' },
    { id: 'vba', name: 'VBA' },
    { id: 'webgl', name: 'WebGL / OpenGL' },
  ];

  const linkData = [
    { source: 'root', target: 'java' },
    { source: 'java', target: 'spring' },
    { source: 'java', target: 'ee' },
    { source: 'java', target: 'hibernate' },
    { source: 'root', target: 'csharp' },
    { source: 'csharp', target: 'windowsphone' },
    { source: 'csharp', target: 'xbox' },
    { source: 'root', target: 'app' },
    { source: 'app', target: 'ios' },
    { source: 'ios', target: 'swift' },
    { source: 'app', target: 'android' },
    { source: 'app', target: 'windowsphone' },
    { source: 'android', target: 'wear' },
    { source: 'root', target: 'web' },
    { source: 'web', target: 'html' },
    { source: 'web', target: 'css' },
    { source: 'web', target: 'js' },
    { source: 'web', target: 'webgl' },
    { source: 'js', target: 'ts' },
    { source: 'js', target: 'angular' },
    { source: 'js', target: 'react' },
    { source: 'js', target: 'd3' },
    { source: 'root', target: 'py' },
    { source: 'py', target: 'django' },
    { source: 'py', target: 'pandas' },
    { source: 'py', target: 'jupyter' },
    { source: 'py', target: 'rpa' },
    { source: 'root', target: 'db' },
    { source: 'db', target: 'sql' },
    { source: 'db', target: 'pg' },
    { source: 'db', target: 'mongo' },
    { source: 'db', target: 'hibernate' },
    { source: 'root', target: 'mode' },
    { source: 'mode', target: 'devops' },
    { source: 'mode', target: 'scrum' },
    { source: 'mode', target: 'agile' },
    { source: 'mode', target: 'kanban' },
    { source: 'root', target: 'cloud' },
    { source: 'cloud', target: 'aws' },
    { source: 'cloud', target: 'azure' },
    { source: 'cloud', target: 'k8s' },
    { source: 'cloud', target: 'minikube' },
    { source: 'cloud', target: 's3' },
    { source: 'root', target: 'tools' },
    { source: 'tools', target: 'git' },
    { source: 'tools', target: 'docker' },
    { source: 'tools', target: 'jira' },
    { source: 'tools', target: 'confluence' },
    { source: 'tools', target: 'gitlab' },
    { source: 'tools', target: 'tableau' },
    { source: 'tools', target: 'excel' },
    { source: 'root', target: 'datawarehouse' },
    { source: 'datawarehouse', target: 'pentaho' },
    { source: 'datawarehouse', target: 'talend' },
    { source: 'datawarehouse', target: 'minio' },
    { source: 'datawarehouse', target: 'pandas' },
    { source: 'datawarehouse', target: 'db' },
    { source: 'root', target: 'excel' },
    { source: 'excel', target: 'vba' },
  ];

  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);

  useEffect(() => {
    StipplingService.get().generate({ imgPath: require('./vita_bw.png'), width: size, samples: nodeData.length, threshold: 0.5 }).then((points) => {
      const positionedNodes = points.map((point, i) => ({ ...nodeData[i], x: point.x, y: point.y }));
      setNodes(positionedNodes);
      setLinks(linkData);
    });
  }, []);

  return <div className="knowledge">
    <h2>Knowledge</h2>
    <p>Here is a list of technologies and tools I have worked with.</p>

    <button onClick={() => setActive(true)}>
      Show Knowledge Graph
    </button>

    {active && <NetworkGraph
      width={size}
      height={size}
      nodes={nodes}
      links={links}
      timeOffset={1000}
    />}

  </div >
}
