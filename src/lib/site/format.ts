import type { Category, City, Project } from './types'

export const cityLabel: Record<City, string> = {
  moscow: 'Москва',
  spb: 'Санкт-Петербург',
  'moscow-region': 'Московская область',
  other: '',
}

export const categoryTitle: Record<Category, string> = {
  interiors: 'Интерьеры',
  architecture: 'Архитектура',
  public: 'Общественные интерьеры',
}

// «2026 Москва, 140 m²», как подпись карточки проекта
export function projectMeta(p: Pick<Project, 'year' | 'city' | 'area'>) {
  const place = cityLabel[p.city]
  return [p.year, [place, `${p.area} m²`].filter(Boolean).join(', ')].filter(Boolean).join(' ')
}

export const projectHref = (slug: string) => `/proekty/${slug}`
