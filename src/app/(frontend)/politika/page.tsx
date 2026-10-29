import type { Metadata } from 'next'
import { JsonLd } from '@/components/site/JsonLd'
import { getContacts } from '@/lib/site/data'
import { operator } from '@/lib/site/legal'
import { PRIVACY_LINES } from '@/lib/site/privacy-text'
import { breadcrumbs } from '@/lib/site/schema'
import { siteUrl } from '@/lib/site/url'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Политика RedONE в отношении обработки персональных данных посетителей сайта.',
  alternates: { canonical: '/politika' },
}

// Подряд идущие строки «- …» собираем в один список
function blocks(lines: string[]) {
  const out: (string | string[])[] = []
  for (const l of lines) {
    if (l.startsWith('- ')) {
      const last = out.at(-1)
      if (Array.isArray(last)) last.push(l.slice(2))
      else out.push([l.slice(2)])
    } else out.push(l)
  }
  return out
}

export default async function PrivacyPage() {
  const op = operator(await getContacts())
  const lines = PRIVACY_LINES.map((l) =>
    l.replaceAll('{OP}', op.full).replaceAll('{SITE}', siteUrl).replaceAll('{EMAIL}', op.email),
  )

  return (
    <main>
      <section className="price-top">
        <h1>Политика конфиденциальности</h1>
      </section>

      <article className="wrap legal">
        <h2>Политика в отношении обработки персональных данных</h2>
        {blocks(lines).map((b, i) =>
          Array.isArray(b) ? (
            <ul key={i}>
              {b.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          ) : /^\d+\. /.test(b) ? (
            <h3 key={i}>{b}</h3>
          ) : (
            <p key={i}>{b}</p>
          ),
        )}
      </article>
      <JsonLd
        data={breadcrumbs([
          { name: 'Главная', path: '/' },
          { name: 'Политика конфиденциальности', path: '/politika' },
        ])}
      />
    </main>
  )
}
