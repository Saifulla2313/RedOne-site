import { getBrand, getContacts, getPricing, getProjects, getServices } from '@/lib/site/data'
import { categoryTitle, projectHref, projectMeta } from '@/lib/site/format'
import { priceLabel, rates, rub } from '@/lib/site/pricing'
import { absUrl } from '@/lib/site/url'

// /llms.txt — краткая выжимка сайта в Markdown для ИИ-ассистентов (формат llmstxt.org).
// Собирается из админки на каждый запрос, поэтому новые услуги, цены и проекты попадают сразу.
export const dynamic = 'force-dynamic'

// заглушки вида «[Юрлицо]» в выжимку не пускаем
const ok = (v?: string) => Boolean(v && !v.includes('[') && v !== '#')

export async function GET() {
  if (process.env.SITE_NOINDEX === '1') return new Response('Not found', { status: 404 })

  const [brand, contacts, pricing, services, projects] = await Promise.all([
    getBrand(),
    getContacts(),
    getPricing(),
    getServices(),
    getProjects(),
  ])
  const r = rates(pricing)
  const link = (title: string, path: string, note?: string) =>
    `- [${title}](${absUrl(path)})${note ? `: ${note}` : ''}`

  const out: string[] = [
    '# RedONE',
    '',
    `> ${brand.slogan}. Бюро RedONE делает дизайн-проекты интерьеров, архитектуру, комплектацию и ремонт под ключ. Пакет ${pricing.fullTitle} — полный цикл от замера до заселения${r.full ? ` от ${rub(r.full)} ₽/м²` : ''}, часть услуг в нём в подарок, гарантия на ремонт 5 лет.`,
    '',
  ]

  const facts = [
    ...contacts.offices.filter((o) => ok(o.address)).map((o) => `Офис, ${o.city}: ${o.address}`),
    ...contacts.phones.filter((p) => ok(p.phone) && !p.phone.includes('000) 000')).map((p) => `Телефон: ${p.phone}`),
    ok(contacts.email) ? `Почта: ${contacts.email}` : '',
  ].filter(Boolean)
  if (facts.length) out.push(...facts.map((f) => `- ${f}`), '')

  out.push(
    '## Услуги и цены',
    '',
    link('Услуги и цены', '/ceny', 'прайс-лист, пакет и условия'),
    link('Расчёт стоимости', '/kviz', 'квиз с калькулятором по площади'),
    ...services.map((s) => {
      const price = pricing.items.find((i) => i.slug === s.slug)
      const note = [s.offer, price ? priceLabel(price) : s.priceFrom ? `от ${rub(s.priceFrom)} ₽/м²` : '']
        .filter(Boolean)
        .join(' — ')
      return link(s.title, `/uslugi/${s.slug}`, note)
    }),
    '',
    '## Прайс',
    '',
    ...pricing.items.map(
      (i) => `- ${i.title}: ${priceLabel(i)}${i.inFull === 'gift' ? ` (в пакете ${pricing.fullTitle} — в подарок)` : ''}`,
    ),
    '',
  )

  const faq = services.flatMap((s) => s.faq)
  if (faq.length) {
    out.push('## Частые вопросы', '', ...faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']))
  }

  out.push(
    '## Проекты',
    '',
    ...Object.entries(categoryTitle).map(([c, t]) => link(t, `/proekty?category=${c}`)),
    ...projects
      .filter((p) => !p.seo?.noindex)
      .slice(0, 50)
      .map((p) => link(p.title, projectHref(p.slug), projectMeta(p))),
    '',
    '## Optional',
    '',
    link('Политика конфиденциальности', '/politika'),
    link('Согласие на обработку персональных данных', '/soglasie'),
    link('Карта сайта', '/sitemap.xml'),
    '',
  )

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
