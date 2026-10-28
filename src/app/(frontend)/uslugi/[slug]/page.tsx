import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { Photo } from '@/components/site/Photo'
import { ProjectGrid } from '@/components/site/ProjectCard'
import { getFeaturedProjects, getService, getServices } from '@/lib/site/data'
import type { Package } from '@/lib/site/types'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = await getService((await params).slug)
  if (!s) return {}
  return { title: s.seo?.title ?? s.title, description: s.seo?.description }
}

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n)

function PackCard({ p }: { p: Package }) {
  return (
    <div className="pack">
      <h3>
        {p.name}
        <small>{p.price ? `от ${rub(p.price)} ₽/m²` : 'цена по запросу'}</small>
      </h3>
      <ol>
        {p.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ol>
    </div>
  )
}

export default async function ServicePage({ params }: { params: Params }) {
  const s = await getService((await params).slug)
  if (!s) notFound()
  const featured = (await getFeaturedProjects()).slice(0, 4)
  // как в образце: фото встаёт перед последним пакетом
  const media = s.packages.find((p) => p.media)?.media ?? s.cover
  const head = s.packages.slice(0, -1)
  const tail = s.packages.at(-1)

  return (
    <main>
      <section className="price-top">
        <h1>{s.title}</h1>
        <div className="packs" style={{ '--n': s.packages.length + 1 } as React.CSSProperties}>
          {head.map((p) => (
            <PackCard key={p.name} p={p} />
          ))}
          <Photo media={media} tone={4} sizes="(max-width: 900px) 100vw, 25vw" label="фото / видео" />
          {tail && <PackCard p={tail} />}
        </div>
      </section>

      {s.scope.length > 0 && (
        <>
          <h2 className="sec-h rv">Состав работ</h2>
          <div className="comp wrap">
            {s.scope.map((row) => (
              <div className="row rv" key={row.label}>
                <h4>{row.label}:</h4>
                <ol>
                  {row.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      )}

      <ExcursionForm />
      <h2 className="sec-h rv">Новые проекты</h2>
      <ProjectGrid projects={featured} />
    </main>
  )
}
