// Заливает прайс RED ONE в админку: страницы услуг и глобал «Прайс».
// Запуск: pnpm payload run src/seed/pricing.ts
// Уже существующие услуги (по slug) и заполненный прайс не трогает. С флагом --force перезаписывает.
import config from '@payload-config'
import { getPayload } from 'payload'
import type { Service } from '../payload-types'
import { pricing, services, toLexical } from '../lib/site/price-list'

const force = process.argv.includes('--force')
const payload = await getPayload({ config })

const ids: Record<string, number> = {}
for (const s of services) {
  const data = {
    title: s.title,
    slug: s.slug,
    priceFrom: s.priceFrom,
    offer: s.offer,
    body: toLexical(s.body) as unknown as Service['body'],
    faq: s.faq,
    seo: s.seo,
    _status: 'published' as const,
  }
  const found = await payload.find({
    collection: 'services',
    where: { slug: { equals: s.slug } },
    limit: 1,
    draft: true,
  })
  const existing = found.docs[0]
  if (existing && !force) {
    ids[s.slug] = existing.id
    payload.logger.info(`услуга «${s.title}» уже есть, пропускаю`)
    continue
  }
  const doc = existing
    ? await payload.update({ collection: 'services', id: existing.id, data })
    : await payload.create({ collection: 'services', data })
  ids[s.slug] = doc.id
  payload.logger.info(`услуга «${s.title}» ${existing ? 'обновлена' : 'создана'}`)
}

const current = await payload.findGlobal({ slug: 'pricing' })
// у несохранённого глобала items приходят из defaultValue, поэтому смотрим на updatedAt
if (current.updatedAt && !force) {
  payload.logger.info('прайс уже заполнен, пропускаю')
} else {
  await payload.updateGlobal({
    slug: 'pricing',
    data: {
      items: pricing.items.map(({ slug, ...i }) => ({ ...i, service: slug ? ids[slug] : null })),
      fullTitle: pricing.fullTitle,
      exampleArea: pricing.exampleArea,
      fullLead: pricing.fullLead,
      team: pricing.team,
      conditions: pricing.conditions.join('\n'),
    },
  })
  payload.logger.info('прайс заполнен')
}

process.exit(0)
