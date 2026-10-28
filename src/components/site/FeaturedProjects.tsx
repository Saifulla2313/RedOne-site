'use client'

import { useState } from 'react'
import type { Project } from '@/lib/site/types'
import { ProjectCard } from './ProjectCard'

const PER_PAGE = 6

// «Новые проекты» с постраничным листанием, как на главной
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(0)
  const pages = Math.ceil(projects.length / PER_PAGE)
  const shown = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <>
      <div className="grid">
        {shown.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={page * PER_PAGE + i} />
        ))}
      </div>
      {pages > 1 && (
        <nav className="pager" aria-label="Страницы">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              className={i === page ? 'on' : ''}
              aria-current={i === page}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          {page < pages - 1 && (
            <button aria-label="Следующая страница" onClick={() => setPage(page + 1)}>
              →
            </button>
          )}
        </nav>
      )}
    </>
  )
}
