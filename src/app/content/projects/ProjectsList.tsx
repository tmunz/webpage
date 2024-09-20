import React from "react"

export const ProjectsList = ({ projects, setSelectedProject }: {
  projects: { id: string, name: string }[], setSelectedProject: (id: string) => void
}) => {
  return <ul>
    {projects.map(p => <li key={p.id}><button onClick={() => setSelectedProject(p.id)}>{p.name}</button></li>)}
  </ul>
}