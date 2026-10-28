import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { Photo } from '@/components/site/Photo'
import { VideoBlock } from '@/components/site/VideoBlock'
import { getProject, getProjects } from '@/lib/site/data'
import { projectMeta } from '@/lib/site/format'
import type { ProjectSection } from '@/lib/site/types'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProject((await params).slug)
  if (!p) return {}
  return {
    title: p.seo?.title ?? p.title,
    description: p.seo?.description ?? p.excerpt,
    robots: p.seo?.noindex ? { index: false } : undefined,
    openGraph: { images: p.seo?.ogImage?.url ?? p.hero?.url ?? p.cover?.url },
  }
}

const sizes: Record<ProjectSection['layout'], string> = {
  full: '100vw',
  vertical: '(max-width: 900px) 100vw, 670px',
  cols2: '(max-width: 900px) 100vw, 50vw',
  cols3: '(max-width: 900px) 100vw, 33vw',
}

function Section({ s, index }: { s: ProjectSection; index: number }) {
  return (
    <>
      {s.title && (
        <div className="pj-room wrap rv">
          <h2>{s.title}</h2>
          {s.text && <p>{s.text}</p>}
        </div>
      )}
      <div className={`pj-${s.layout} wrap rv`}>
        {s.photos.map((m, i) => (
          <Photo
            key={i}
            media={m}
            tone={index + i + 1}
            sizes={sizes[s.layout]}
            label={s.title?.toLowerCase()}
          />
        ))}
      </div>
    </>
  )
}

export default async function ProjectPage({ params }: { params: Params }) {
  const p = await getProject((await params).slug)
  if (!p) notFound()
  const [first, ...rest] = p.sections

  return (
    <main className="pj">
      <div className="pj-top wrap">
        <h1>{p.title}</h1>
        <p>{projectMeta(p)}</p>
      </div>
      <div className="pj-hero wrap">
        <Photo media={p.hero ?? p.cover} tone={2} priority label="главное фото" />
      </div>
      <div className="pj-area wrap rv">
        <b>{p.area} m²</b>
        {p.excerpt && <p>{p.excerpt}</p>}
      </div>

      {first && <Section s={first} index={0} />}
      {p.videoUrl && (
        <div className="pj-video wrap rv">
          <VideoBlock url={p.videoUrl} poster={p.cover} />
        </div>
      )}
      {rest.map((s, i) => (
        <Fragment key={i}>
          <Section s={s} index={i + 1} />
          {i === 0 && <ExcursionForm />}
        </Fragment>
      ))}

      <ExcursionForm />
    </main>
  )
}
