import type { Metadata } from 'next'
import Link from 'next/link'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { JsonLd } from '@/components/site/JsonLd'
import { getContacts } from '@/lib/site/data'
import { breadcrumbs } from '@/lib/site/schema'

export const metadata: Metadata = {
  title: 'Контакты',
  description:
    'Адреса офисов RedONE, телефон, почта и соцсети. Приезжайте в офис или запишитесь на экскурсию по готовому объекту.',
  alternates: { canonical: '/kontakty' },
}

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const route = (city: string, address: string) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(`${city}, ${address}`)}`

export default async function ContactsPage() {
  const c = await getContacts()
  const requisites = [
    c.company,
    c.inn && `ИНН ${c.inn}`,
    c.ogrn && `ОГРН ${c.ogrn}`,
    c.legalAddress,
  ].filter(Boolean)

  return (
    <main>
      <section className="price-top">
        <h1>Контакты</h1>
      </section>

      <section className="wrap kt">
        {c.offices.map((o) => (
          <div className="kt-col rv" key={o.city}>
            <h2 className="kt-h">{o.city}</h2>
            <p>{o.address}</p>
            {o.hours && <p>{o.hours}</p>}
            <a
              className="kt-lnk"
              href={route(o.city, o.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Построить маршрут
            </a>
          </div>
        ))}
        <div className="kt-col rv">
          {c.phones.map((p) => (
            <div key={p.phone}>
              {p.label && <p>{p.label}</p>}
              <h2 className="kt-h">
                <a href={tel(p.phone)}>{p.phone}</a>
              </h2>
            </div>
          ))}
          <p className="kt-lbl">Свяжитесь с нами:</p>
          <Link className="btn s" href="/kviz">
            Написать нам
          </Link>
        </div>
        <div className="kt-col rv">
          <h2 className="kt-h">
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </h2>
          {c.socials.length > 0 && (
            <>
              <p className="kt-lbl">Соцсети</p>
              <div className="soc">
                {c.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {requisites.length > 0 && (
        <section className="wrap kt-req rv">
          <p className="kt-lbl">Реквизиты</p>
          {requisites.map((r) => (
            <p key={r}>{r}</p>
          ))}
        </section>
      )}

      <ExcursionForm />
      <JsonLd
        data={breadcrumbs([
          { name: 'Главная', path: '/' },
          { name: 'Контакты', path: '/kontakty' },
        ])}
      />
    </main>
  )
}
