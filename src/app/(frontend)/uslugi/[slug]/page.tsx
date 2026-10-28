import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { Photo } from '@/components/site/Photo'
import { ProjectGrid } from '@/components/site/ProjectCard'
import { getFeaturedProjects, getPricing, getService } from '@/lib/site/data'
import { fullLabel, priceLabel, rub } from '@/lib/site/pricing'
import type { Package } from '@/lib/site/types'
import '../../pricing.css'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = await getService((await params).slug)
  if (!s) return {}
  return { title: s.seo?.title ?? s.title, description: s.seo?.description ?? s.offer }
}

function PackCard({ p }: { p: Package }) {
  return (
    <div className="pack">
      <h2>
        {p.name}
        <small>{p.price ? `от ${rub(p.price)} ₽/m²` : 'цена по запросу'}</small>
      </h2>
      <ol>
        {p.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ol>
    </div>
  )
}

export default async function ServicePage({ params }: { params: Params }) {
  const slug = (await params).slug
  const [s, pricing] = await Promise.all([getService(slug), getPricing()])
  if (!s) notFound()
  const featured = (await getFeaturedProjects()).slice(0, 4)
  const price = pricing.items.find((i) => i.slug === s.slug)
  // как в образце: фото встаёт перед последним пакетом
  const media = s.packages.find((p) => p.media)?.media ?? s.cover
  const head = s.packages.slice(0, -1)
  const tail = s.packages.at(-1)

  return (
    <main>
      <section className="price-top">
        <h1>{s.title}</h1>
        {s.packages.length > 0 && (
          <div className="packs" style={{ '--n': s.packages.length + 1 } as React.CSSProperties}>
            {head.map((p) => (
              <PackCard key={p.name} p={p} />
            ))}
            <Photo
              media={media}
              tone={4}
              sizes="(max-width: 900px) 100vw, 25vw"
              label="фото / видео"
            />
            {tail && <PackCard p={tail} />}
          </div>
        )}
      </section>

      {(s.offer || price || s.priceFrom > 0) && (
        <section className="wrap svc-head">
          {s.offer && <p className="lead">{s.offer}</p>}
          <div className="svc-price">
            {price ? (
              <>
                <p>
                  <span>Стоимость</span>
                  <b>{priceLabel(price)}</b>
                </p>
                <p className={price.inFull === 'gift' ? 'gift' : undefined}>
                  <span>В пакете {pricing.fullTitle}</span>
                  <b>{fullLabel(price)}</b>
                </p>
              </>
            ) : (
              <p>
                <span>Стоимость</span>
                <b>от {rub(s.priceFrom)} ₽/м²</b>
              </p>
            )}
            {s.term && (
              <p>
                <span>Срок</span>
                <b>{s.term}</b>
              </p>
            )}
          </div>
          <div className="svc-cta">
            <Link className="btn l" href="/kviz">
              Рассчитать стоимость
            </Link>
            <Link className="btn l dark" href="/ceny">
              Все услуги и пакет {pricing.fullTitle}
            </Link>
          </div>
        </section>
      )}

      {s.body && (
        <section className="wrap svc-body">
          <RichText data={s.body} />
        </section>
      )}

      {s.scope.length > 0 && (
        <>
          <h2 className="sec-h rv">Состав работ</h2>
          <div className="comp wrap">
            {s.scope.map((row) => (
              <div className="row rv" key={row.label}>
                <h3>{row.label}:</h3>
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

      {s.faq.length > 0 && (
        <section className="wrap svc-faq">
          <h2 className="pr-h">Вопросы и ответы</h2>
          {s.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <script
            type="application/ld+json"
            // JSON.stringify не экранирует «</», поэтому заменяем вручную
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: s.faq.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }).replace(/</g, '\\u003c'),
            }}
          />
        </section>
      )}

      <ExcursionForm />
      <h2 className="sec-h rv">Новые проекты</h2>
      <ProjectGrid projects={featured} />
    </main>
  )
}
