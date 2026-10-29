import type { Metadata } from 'next'
import Link from 'next/link'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { JsonLd } from '@/components/site/JsonLd'
import { Photo } from '@/components/site/Photo'
import { getPricing, getServices } from '@/lib/site/data'
import { priceLabel, rates, rub } from '@/lib/site/pricing'
import { breadcrumbs } from '@/lib/site/schema'
import '../pricing.css'

export const metadata: Metadata = {
  title: 'Услуги: дизайн интерьера, проектирование и ремонт под ключ',
  description:
    'Замер, планировка, визуализация, рабочие и инженерные чертежи, смета, комплектация, авторский надзор и ремонт под ключ с гарантией 5 лет.',
  alternates: { canonical: '/uslugi' },
}

export default async function ServicesPage() {
  const [services, pricing] = await Promise.all([getServices(), getPricing()])
  // порядок как в прайсе, услуги без строки в прайсе — в конце
  const pos = (slug: string) => {
    const i = pricing.items.findIndex((p) => p.slug === slug)
    return i < 0 ? Infinity : i
  }
  const sorted = [...services].sort((a, b) => pos(a.slug) - pos(b.slug))
  const r = rates(pricing)

  return (
    <main className="prices">
      <section className="price-top">
        <h1>Услуги</h1>
      </section>

      <section className="wrap pr-sec">
        <ul className="svc-grid">
          {sorted.map((s, i) => {
            const price = pricing.items.find((p) => p.slug === s.slug)
            return (
              <li key={s.slug}>
                <Link href={`/uslugi/${s.slug}`} className="svc-card">
                  <Photo
                    media={s.cover}
                    tone={i + 1}
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="svc-ph"
                  />
                  <h2>{s.title}</h2>
                  {s.offer && <p>{s.offer}</p>}
                  <span className="svc-meta">
                    <b>
                      {price
                        ? priceLabel(price)
                        : s.priceFrom > 0
                          ? `от ${rub(s.priceFrom)} ₽/м²`
                          : ''}
                    </b>
                    {price?.inFull === 'gift' && (
                      <em className="gift">в {pricing.fullTitle} — в подарок</em>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {pricing.items.length > 0 && (
        <section className="wrap pr-sec full">
          <h2 className="pr-h">
            Пакет {pricing.fullTitle}
            <small>от замера до заселения</small>
          </h2>
          <p className="lead">{pricing.fullLead}</p>
          <div className="full-nums">
            <p>
              <b>{rub(r.full)} ₽/м²</b>
              <span>
                замеры, проектирование и смета вместо <s>{rub(r.separate)} ₽/м²</s>
              </span>
            </p>
            <p>
              <b>−{rub(r.saving)} ₽</b>
              <span>с каждого квадратного метра</span>
            </p>
            <p>
              <b>5 лет</b>
              <span>гарантия на ремонтно-строительные работы</span>
            </p>
          </div>
          <div className="svc-cta">
            <Link className="btn l" href="/ceny">
              Все цены и калькулятор
            </Link>
            <Link className="btn l dark" href="/kviz">
              Рассчитать стоимость
            </Link>
          </div>
        </section>
      )}

      <ExcursionForm />
      <JsonLd
        data={breadcrumbs([
          { name: 'Главная', path: '/' },
          { name: 'Услуги', path: '/uslugi' },
        ])}
      />
    </main>
  )
}
