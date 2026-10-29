// Источник данных для публичных страниц: Payload Local API.
// Читаем с overrideAccess: false, поэтому сайт видит только опубликованное (access.publishedOrStaff).
// В разработке, пока в админке пусто или база не поднята, страницы показывают заглушки из placeholder.ts.
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Media as PMedia, Project as PProject, Service as PService } from '@/payload-types'
import * as placeholder from './placeholder'
import type {
  Brand,
  Category,
  Analytics,
  Contacts,
  Media,
  MenuItem,
  PriceItem,
  Pricing,
  Project,
  ProjectStatus,
  Quiz,
  Service,
} from './types'

const dev = process.env.NODE_ENV !== 'production'

const payload = () => getPayload({ config })

// В проде ошибку базы не прячем, в разработке подменяем заглушкой
async function withFallback<T>(
  load: () => Promise<T>,
  fallback: () => Promise<T>,
  empty: (v: T) => boolean,
) {
  try {
    const value = await load()
    return dev && empty(value) ? fallback() : value
  } catch (err) {
    if (!dev) throw err
    console.warn('[site] данные из админки недоступны, показываю заглушки:', (err as Error).message)
    return fallback()
  }
}

const media = (m: number | PMedia | null | undefined, size?: 'card' | 'wide'): Media => {
  if (!m || typeof m === 'number' || !m.url) return null
  const variant = size ? m.sizes?.[size] : undefined
  return {
    url: variant?.url ?? m.url,
    alt: m.alt,
    width: variant?.width ?? m.width ?? undefined,
    height: variant?.height ?? m.height ?? undefined,
  }
}

const lines = (s: string | null | undefined) =>
  (s ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

const toProject = (p: PProject): Project => ({
  slug: p.slug ?? String(p.id),
  title: p.title,
  cover: media(p.cover, 'card'),
  hero: media(p.hero, 'wide'),
  excerpt: p.excerpt ?? undefined,
  videoUrl: p.videoUrl ?? undefined,
  category: p.category,
  type: p.type,
  status: p.status,
  area: p.area,
  year: p.year ?? undefined,
  city: p.city ?? 'other',
  sections: (p.sections ?? []).map((s) => ({
    title: s.title,
    layout: s.layout,
    text: s.text ?? undefined,
    photos: (s.photos ?? []).map((m) => media(m, s.layout === 'full' ? 'wide' : 'card')),
  })),
  featured: p.featured ?? false,
  order: p.order ?? undefined,
  seo: p.seo
    ? {
        title: p.seo.title ?? undefined,
        description: p.seo.description ?? undefined,
        ogImage: media(p.seo.ogImage),
        noindex: p.seo.noindex ?? false,
      }
    : undefined,
})

const toService = (s: PService): Service => ({
  slug: s.slug ?? String(s.id),
  title: s.title,
  priceFrom: s.priceFrom,
  offer: s.offer ?? undefined,
  term: s.term ?? undefined,
  cover: media(s.cover, 'card'),
  body: s.body ?? null,
  packages: (s.packages ?? []).map((p) => ({
    name: p.name,
    price: p.priceFrom ?? undefined,
    items: lines(p.items),
    media: media(p.media, 'card'),
  })),
  scope: (s.scope ?? []).map((r) => ({ label: r.label, items: lines(r.items) })),
  faq: (s.faq ?? []).map((f) => ({ q: f.q, a: f.a })),
  seo: s.seo
    ? { title: s.seo.title ?? undefined, description: s.seo.description ?? undefined }
    : undefined,
})

const isEmpty = (v: unknown[]) => v.length === 0

export function getProjects(filter: { category?: Category; status?: ProjectStatus } = {}) {
  return withFallback(
    async () => {
      const res = await (
        await payload()
      ).find({
        collection: 'projects',
        overrideAccess: false,
        depth: 1,
        limit: 200,
        sort: ['order', '-year'],
        where: {
          ...(filter.category ? { category: { equals: filter.category } } : {}),
          ...(filter.status ? { status: { equals: filter.status } } : {}),
        },
      })
      return res.docs.map(toProject)
    },
    () => placeholder.getProjects(filter),
    isEmpty,
  )
}

export function getFeaturedProjects() {
  return withFallback(
    async () => {
      const res = await (
        await payload()
      ).find({
        collection: 'projects',
        overrideAccess: false,
        depth: 1,
        limit: 24,
        sort: ['order', '-year'],
        where: { featured: { equals: true } },
      })
      return res.docs.map(toProject)
    },
    placeholder.getFeaturedProjects,
    isEmpty,
  )
}

export function getProject(slug: string) {
  return withFallback(
    async () => {
      const res = await (
        await payload()
      ).find({
        collection: 'projects',
        overrideAccess: false,
        depth: 1,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      return res.docs[0] ? toProject(res.docs[0]) : null
    },
    () => placeholder.getProject(slug),
    (v) => v === null,
  )
}

export function getServices() {
  return withFallback(
    async () => {
      const res = await (
        await payload()
      ).find({
        collection: 'services',
        overrideAccess: false,
        depth: 1,
        limit: 50,
      })
      return res.docs.map(toService)
    },
    placeholder.getServices,
    isEmpty,
  )
}

export function getService(slug: string) {
  return withFallback(
    async () => {
      const res = await (
        await payload()
      ).find({
        collection: 'services',
        overrideAccess: false,
        depth: 1,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      return res.docs[0] ? toService(res.docs[0]) : null
    },
    () => placeholder.getService(slug),
    (v) => v === null,
  )
}

// Пустые поля глобалов добиваем заглушками только в разработке
const orDev = <T>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)
    ? dev
      ? fallback
      : (value ?? fallback)
    : value

export async function getBrand(): Promise<Brand> {
  const fb = await placeholder.getBrand()
  return withFallback(
    async () => {
      const b = await (
        await payload()
      ).findGlobal({ slug: 'brand', overrideAccess: false, depth: 1 })
      const video = media(b.heroVideo)
      return {
        logo: media(b.logo),
        heroVideo: video ? { url: video.url, poster: media(b.heroPoster, 'wide') } : null,
        slogan: orDev(b.slogan, fb.slogan),
        heroCta: orDev(b.heroCta, fb.heroCta),
        heroCtaAction: b.heroCtaAction ?? 'quiz',
        stats: orDev(
          b.stats?.map((s) => ({ value: s.value, label: s.label })),
          fb.stats,
        ),
        teamPhoto: media(b.teamPhoto, 'wide'),
        officeSlider: orDev(
          b.officeSlider?.map((m) => media(m, 'wide')),
          fb.officeSlider,
        ),
      }
    },
    async () => fb,
    () => false,
  )
}

const socialLabel = {
  telegram: 'TG',
  vk: 'VK',
  youtube: 'YT',
  dzen: 'Дзен',
  pinterest: 'P',
} as const

export async function getContacts(): Promise<Contacts> {
  const fb = await placeholder.getContacts()
  return withFallback(
    async () => {
      const c = await (await payload()).findGlobal({ slug: 'contacts', overrideAccess: false })
      return {
        phones: orDev(
          c.phones?.map((p) => ({ label: p.label ?? undefined, phone: p.phone })),
          fb.phones,
        ),
        offices: orDev(
          c.offices?.map((o) => ({
            city: o.city,
            address: o.address,
            hours: o.hours ?? undefined,
          })),
          fb.offices,
        ),
        email: orDev(c.email, fb.email),
        socials: orDev(
          c.socials?.map((s) => ({ name: socialLabel[s.network], url: s.url })),
          fb.socials,
        ),
        company: orDev(c.company, fb.company),
        inn: orDev(c.inn, fb.inn),
        ogrn: orDev(c.ogrn, fb.ogrn),
        legalAddress: orDev(c.legalAddress, fb.legalAddress),
        privacyEmail: c.privacyEmail || orDev(c.email, fb.privacyEmail),
      }
    },
    async () => fb,
    () => false,
  )
}

export async function getPricing(): Promise<Pricing> {
  return withFallback(
    async () => {
      const p = await (
        await payload()
      ).findGlobal({ slug: 'pricing', overrideAccess: false, depth: 1 })
      return {
        items: (p.items ?? []).map((i): PriceItem => ({
          title: i.title,
          price: i.price,
          unit: i.unit,
          basis: i.basis ?? undefined,
          inFull: i.inFull,
          slug: typeof i.service === 'object' ? (i.service?.slug ?? undefined) : undefined,
        })),
        fullTitle: p.fullTitle || 'FULL',
        exampleArea: p.exampleArea || 100,
        fullLead: p.fullLead ?? '',
        team: p.team ?? '',
        conditions: lines(p.conditions),
      }
    },
    placeholder.getPricing,
    (v) => v.items.length === 0,
  )
}

export async function getMenu(): Promise<MenuItem[]> {
  return withFallback(
    async () => {
      const m = await (await payload()).findGlobal({ slug: 'menu', overrideAccess: false })
      return (m.items ?? []).map((i) => ({ label: i.label, link: i.link }))
    },
    placeholder.getMenu,
    isEmpty,
  )
}

export async function getQuiz(): Promise<Quiz> {
  const fb = await placeholder.getQuiz()
  return withFallback(
    async () => {
      const q = await (await payload()).findGlobal({ slug: 'quiz', overrideAccess: false })
      const steps = (q.steps ?? []).map((s) => ({
        q: s.question,
        kind: s.kind,
        options: lines(s.options),
      }))
      return {
        intro: fb.intro,
        // без шага с контактами заявку не отправить, поэтому добавляем его сами
        steps: steps.length
          ? steps.some((s) => s.kind === 'contacts')
            ? steps
            : [...steps, { q: 'Куда отправить расчёт?', kind: 'contacts' as const }]
          : fb.steps,
        final: q.finalText || fb.final,
      }
    },
    async () => fb,
    () => false,
  )
}

// Код Вебмастера и номер Метрики: переменные окружения важнее админки.
// «Интеграции» закрыты от публичного чтения, поэтому читаем с overrideAccess и берём только номер счётчика.
export const getAnalytics = cache(async (): Promise<Analytics> => {
  const env = {
    yandexVerification: process.env.YANDEX_VERIFICATION?.trim() || undefined,
    metrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.replace(/\D/g, '') || undefined,
  }
  if (env.yandexVerification && env.metrikaId) return env
  try {
    const p = await payload()
    const [seo, integrations] = await Promise.all([
      p.findGlobal({ slug: 'seo-defaults', overrideAccess: false }),
      p.findGlobal({ slug: 'integrations', overrideAccess: true, select: { metrikaId: true } }),
    ])
    const id = integrations.metrikaId?.replace(/\D/g, '')
    return {
      yandexVerification: env.yandexVerification ?? (seo.yandexVerification?.trim() || undefined),
      metrikaId: env.metrikaId ?? (id || undefined),
    }
  } catch (err) {
    if (!dev) throw err
    return env
  }
})
