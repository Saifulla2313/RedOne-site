import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectGrid } from '@/components/site/ProjectCard'
import { getProjects } from '@/lib/site/data'
import { categoryTitle } from '@/lib/site/format'
import type { Category, ProjectStatus } from '@/lib/site/types'

type Search = Promise<{ category?: string; status?: string }>

const isCategory = (v?: string): v is Category => !!v && v in categoryTitle
const tabs: { key: ProjectStatus | 'all'; label: string }[] = [
  { key: 'done', label: 'Реализовано' },
  { key: 'wip', label: 'В работе' },
  { key: 'all', label: 'Все проекты' },
]

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { category } = await searchParams
  const title = isCategory(category) ? categoryTitle[category] : 'Портфолио'
  return { title, alternates: { canonical: isCategory(category) ? `/proekty?category=${category}` : '/proekty' } }
}

export default async function CatalogPage({ searchParams }: { searchParams: Search }) {
  const { category: c, status: s } = await searchParams
  const category = isCategory(c) ? c : undefined
  const status = s === 'wip' || s === 'all' ? s : 'done'
  const projects = await getProjects({ category, status: status === 'all' ? undefined : status })

  const href = (st: string) => {
    const q = new URLSearchParams()
    if (category) q.set('category', category)
    if (st !== 'done') q.set('status', st)
    const qs = q.toString()
    return qs ? `/proekty?${qs}` : '/proekty'
  }

  return (
    <main>
      <h1 className="big-h cat-h">{category ? categoryTitle[category] : 'Портфолио'}</h1>
      <nav className="tabs" aria-label="Статус проектов">
        {tabs.map((t) => (
          <Link key={t.key} href={href(t.key)} className={t.key === status ? 'on' : ''} aria-current={t.key === status ? 'page' : undefined} scroll={false}>
            {t.label}
          </Link>
        ))}
      </nav>
      <ProjectGrid projects={projects} />
    </main>
  )
}
