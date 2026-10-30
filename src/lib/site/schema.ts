// Микроразметка schema.org (JSON-LD) для Яндекса и Google.
// Проверка: https://webmaster.yandex.ru/tools/microtest/ и https://validator.schema.org/
import { categoryTitle, cityLabel, projectHref } from './format'
import { absUrl, siteUrl } from './url'
import type { Brand, Contacts, PriceItem, Pricing, Project, Service } from './types'

const ORG_ID = `${siteUrl}/#org`
const SITE_ID = `${siteUrl}/#website`

// Убираем пустые значения и заглушки вида «[номер]» или «#», чтобы в разметку не попал мусор
function clean<T>(v: T): T | undefined {
  if (v === null || v === undefined || v === '') return undefined
  if (typeof v === 'string') return v.includes('[') || v === '#' ? undefined : v
  if (Array.isArray(v)) {
    const arr = v.map(clean).filter((x) => x !== undefined)
    return (arr.length ? arr : undefined) as T
  }
  if (typeof v === 'object') {
    const entries = Object.entries(v)
      .map(([k, x]) => [k, clean(x)] as const)
      .filter(([, x]) => x !== undefined)
    // объект только из @type/@context ничего не сообщает (а ссылка { '@id' } — сообщает)
    const meaningful = entries.some(([k]) => k !== '@type' && k !== '@context')
    return (meaningful ? Object.fromEntries(entries) : undefined) as T
  }
  return v
}

const ld = (data: object) => clean({ '@context': 'https://schema.org', ...data }) ?? {}

const cities = (c: Contacts) => c.offices.map((o) => o.city)

const address = (o: Contacts['offices'][number]) => ({
  '@type': 'PostalAddress',
  addressCountry: 'RU',
  addressLocality: o.city,
  streetAddress: o.address,
})

// Бюро целиком: тип ProfessionalService (разновидность LocalBusiness), филиалы — department
export function organization(brand: Brand, c: Contacts) {
  const [main, ...rest] = c.offices
  const phone = c.phones[0]?.phone
  return ld({
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: siteUrl,
        name: 'RedONE',
        inLanguage: 'ru-RU',
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'ProfessionalService',
        '@id': ORG_ID,
        name: 'RedONE',
        alternateName: 'RED ONE',
        description: brand.slogan,
        url: siteUrl,
        logo: absUrl(brand.logo?.url ?? '/brand/logo-square.png'),
        image: brand.teamPhoto
          ? absUrl(brand.teamPhoto.url)
          : brand.logo
            ? absUrl(brand.logo.url)
            : undefined,
        telephone: phone,
        email: c.email,
        address: main ? address(main) : undefined,
        areaServed: cities(c),
        sameAs: c.socials.map((s) => s.url),
        legalName: c.company,
        taxID: c.inn,
        department: rest.map((o) => ({
          '@type': 'ProfessionalService',
          name: `RedONE — ${o.city}`,
          address: address(o),
          telephone: phone,
          parentOrganization: { '@id': ORG_ID },
        })),
      },
    ],
  })
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return ld({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  })
}

const unitCode = { m2: 'MTK', month: 'MON' } as const

// Цена за м² или за месяц; проценты от закупок числом не выразить, их отдаём только названием
function priceSpec(i: Pick<PriceItem, 'price' | 'unit'>) {
  if (i.unit === 'percent') return undefined
  return {
    '@type': 'UnitPriceSpecification',
    price: i.price,
    priceCurrency: 'RUB',
    unitCode: unitCode[i.unit],
    unitText: i.unit === 'm2' ? 'м²' : 'месяц',
  }
}

export function service(s: Service, c: Contacts, price?: PriceItem) {
  const spec = price
    ? priceSpec(price)
    : s.priceFrom > 0
      ? priceSpec({ price: s.priceFrom, unit: 'm2' })
      : undefined
  return ld({
    '@type': 'Service',
    name: s.title,
    serviceType: s.title,
    description: s.seo?.description ?? s.offer,
    url: absUrl(`/uslugi/${s.slug}`),
    image: s.cover ? absUrl(s.cover.url) : undefined,
    provider: { '@id': ORG_ID },
    areaServed: cities(c),
    offers: spec
      ? { '@type': 'Offer', priceCurrency: 'RUB', price: spec.price, priceSpecification: spec }
      : undefined,
  })
}

export function priceCatalog(p: Pricing) {
  return ld({
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги и цены',
      url: absUrl('/ceny'),
      itemListElement: p.items.map((i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: i.title,
          url: i.slug ? absUrl(`/uslugi/${i.slug}`) : undefined,
        },
        priceCurrency: 'RUB',
        priceSpecification: priceSpec(i),
        description: i.unit === 'percent' ? `${i.price}% ${i.basis ?? ''}`.trim() : undefined,
      })),
    },
  })
}

export function project(p: Project) {
  const img = p.hero ?? p.cover
  return ld({
    '@type': 'CreativeWork',
    name: p.title,
    description: p.seo?.description ?? p.excerpt,
    url: absUrl(projectHref(p.slug)),
    image: img ? absUrl(img.url) : undefined,
    dateCreated: p.year ? String(p.year) : undefined,
    genre: categoryTitle[p.category],
    locationCreated: cityLabel[p.city] ? { '@type': 'Place', name: cityLabel[p.city] } : undefined,
    creator: { '@id': ORG_ID },
  })
}
