import Link from 'next/link'
import { projectHref, projectMeta } from '@/lib/site/format'
import type { Project } from '@/lib/site/types'
import { Photo } from './Photo'

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <Link className="card rv" href={projectHref(project.slug)}>
      <Photo media={project.cover} tone={index + 1} sizes="(max-width: 900px) 100vw, 50vw" label="фото проекта" />
      <div className="t">
        <h3>{project.title}</h3>
        <p>{projectMeta(project)}</p>
      </div>
    </Link>
  )
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="empty">Здесь скоро появятся проекты.</p>
  return (
    <div className="grid">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  )
}
