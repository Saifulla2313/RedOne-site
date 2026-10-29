import type { MetadataRoute } from 'next'
import { getProjects, getServices } from '@/lib/site/data'
import { categoryTitle } from '@/lib/site/format'
import { absUrl } from '@/lib/site/url'

// Список страниц берём из админки на каждый запрос, чтобы новые проекты сразу попадали в карту
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services] = await Promise.all([getProjects(), getServices()])
  if (process.env.SITE_NOINDEX === '1') return []
  const url = absUrl
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/proekty'), changeFrequency: 'weekly', priority: 0.9 },
    ...Object.keys(categoryTitle).map((c) => ({
      url: url(`/proekty?category=${c}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...projects
      .filter((p) => !p.seo?.noindex)
      .map((p) => ({
        url: url(`/proekty/${p.slug}`),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    { url: url('/uslugi'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/ceny'), changeFrequency: 'monthly', priority: 0.9 },
    ...services.map((s) => ({
      url: url(`/uslugi/${s.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: url('/kviz'), changeFrequency: 'yearly', priority: 0.5 },
    { url: url('/politika'), changeFrequency: 'yearly', priority: 0.1 },
    { url: url('/soglasie'), changeFrequency: 'yearly', priority: 0.1 },
  ]
}
