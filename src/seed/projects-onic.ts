// Заливает в админку проекты дизайнера со страницы vk.ru/design_interior_onic (визуализации RED ONE).
// Запуск: pnpm payload run src/seed/projects-onic.ts
// Фото лежат в src/seed/assets/onic/<slug>/. Уже существующие проекты (по slug) не трогает, с --force перезаписывает.
// Площади примерные: уточните их в админке.
import config from '@payload-config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import type { Project } from '../payload-types'

type Layout = 'full' | 'vertical' | 'cols2' | 'cols3'
type Seed = {
  slug: string
  title: string
  category: Project['category']
  type: Project['type']
  area: number
  year?: number
  excerpt: string
  cover: string
  hero: string
  sections: { title: string; layout: Layout; text?: string; photos: string[] }[]
  order: number
  featured: boolean
}

const projects: Seed[] = [
  {
    slug: 'dom-v-kaspiyske',
    title: 'Дом в Каспийске',
    category: 'architecture',
    type: 'house',
    area: 320,
    year: 2025,
    excerpt:
      'Загородный дом для двух молодых семей. Две зеркальные половины с отдельными входами и гаражами, белые объёмы фасада и тёплая вечерняя подсветка.',
    cover: 'p679-01',
    hero: 'p679-00',
    sections: [
      { title: 'Фасады', layout: 'full', photos: ['p679-02', 'p679-03'] },
      { title: 'Въездная группа', layout: 'cols2', photos: ['p679-07', 'p679-04'] },
    ],
    order: 10,
    featured: true,
  },
  {
    slug: 'salon-de-la-rosa',
    title: 'Салон красоты de la Rosa',
    category: 'public',
    type: 'commercial',
    area: 140,
    excerpt:
      'Салон с маникюрной зоной, кабинетами косметологии и комнатой для персонала. Белые стены, терракотовые акценты и плетёная мебель.',
    cover: 'p669-04',
    hero: 'p669-02',
    sections: [
      { title: 'Маникюрная зона', layout: 'cols2', photos: ['p669-02', 'p669-03'] },
      { title: 'Кабинеты косметологии', layout: 'cols2', photos: ['p669-06', 'p669-07'] },
      { title: 'Детали', layout: 'cols3', photos: ['p669-00', 'p669-04', 'p669-09'] },
      { title: 'Комната персонала', layout: 'cols3', photos: ['p670-00', 'p670-01', 'p670-03'] },
      { title: 'Санузел', layout: 'cols3', photos: ['p670-04', 'p670-05', 'p670-06'] },
    ],
    order: 20,
    featured: true,
  },
  {
    slug: 'kvartira-s-lepninoy',
    title: 'Квартира с лепниной',
    category: 'interiors',
    type: 'apartment',
    area: 150,
    excerpt:
      'Классика в современном прочтении: лепнина и молдинги, паркет ёлочкой, кухня с мраморным островом и столовая под многорожковой люстрой.',
    cover: 'p662-03',
    hero: 'p662-01',
    sections: [
      { title: 'Кухня', layout: 'cols2', photos: ['p662-01', 'p662-00'] },
      { title: 'Столовая', layout: 'cols2', photos: ['p662-03', 'p662-04'] },
      { title: 'Детали', layout: 'cols3', photos: ['p662-05', 'p662-06', 'p662-08'] },
    ],
    order: 30,
    featured: true,
  },
  {
    slug: 'kafe-loft-grill',
    title: 'Кафе Loft Grill',
    category: 'public',
    type: 'commercial',
    area: 160,
    excerpt:
      'Кафе в лофте с панорамными окнами: стены в дереве, высокие столы, табуреты из массива и живые деревья в кадках.',
    cover: 'p690-01',
    hero: 'p690-03',
    sections: [
      { title: 'Зал', layout: 'full', photos: ['p690-02'] },
      { title: 'Атмосфера', layout: 'cols3', photos: ['p691-00', 'p691-01', 'p691-03'] },
      { title: 'Детали', layout: 'cols3', photos: ['p691-04', 'p691-05', 'p691-07'] },
      { title: 'У окна', layout: 'cols2', photos: ['p691-08', 'p691-09'] },
    ],
    order: 40,
    featured: true,
  },
  {
    slug: 'kofeynya-s-zelenyu',
    title: 'Кофейня с зелёным потолком',
    category: 'public',
    type: 'commercial',
    area: 90,
    excerpt:
      'Кофейня с подвесными кашпо над стойкой, арками и круглыми столами. Тёплое дерево, синие акценты и много живой зелени.',
    cover: 'p665-04',
    hero: 'p665-05',
    sections: [
      { title: 'Зал', layout: 'full', photos: ['p665-04'] },
      { title: 'Барная стойка', layout: 'cols3', photos: ['p665-00', 'p665-01', 'p665-02'] },
    ],
    order: 50,
    featured: true,
  },
  {
    slug: 'komnata-s-rabochim-mestom',
    title: 'Комната с рабочим местом',
    category: 'interiors',
    type: 'apartment',
    area: 18,
    excerpt:
      'Спальня с встроенным диваном, рабочим столом и открытыми полками. Дерево, светлый текстиль и мягкий дневной свет.',
    cover: 'p686-01',
    hero: 'p686-00',
    sections: [{ title: 'Детали', layout: 'cols3', photos: ['p686-02', 'p686-03', 'p686-04'] }],
    order: 60,
    featured: true,
  },
  {
    slug: 'dom-v-gorah',
    title: 'Дом в горах',
    category: 'architecture',
    type: 'house',
    area: 220,
    excerpt:
      'Дом в горах Лакского района Дагестана: стены из камня, большие окна и вечерняя подсветка фасада.',
    cover: 'p674-00',
    hero: 'p674-00',
    sections: [],
    order: 70,
    featured: false,
  },
]

const force = process.argv.includes('--force')
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets/onic')
const payload = await getPayload({ config })

for (const p of projects) {
  const found = await payload.find({
    collection: 'projects',
    where: { slug: { equals: p.slug } },
    limit: 1,
    draft: true,
  })
  const existing = found.docs[0]
  if (existing && !force) {
    payload.logger.info(`проект «${p.title}» уже есть, пропускаю`)
    continue
  }

  // одно фото загружаем один раз, даже если оно встречается в нескольких местах
  const ids = new Map<string, number>()
  const upload = async (name: string) => {
    const known = ids.get(name)
    if (known) return known
    const doc = await payload.create({
      collection: 'media',
      data: { alt: `${p.title}: визуализация`, rights: 'own' },
      filePath: path.join(dir, p.slug, `${name}.jpg`),
    })
    ids.set(name, doc.id)
    return doc.id
  }

  const data = {
    title: p.title,
    slug: p.slug,
    category: p.category,
    type: p.type,
    status: 'done' as const,
    area: p.area,
    year: p.year,
    city: 'other' as const,
    excerpt: p.excerpt,
    cover: await upload(p.cover),
    hero: await upload(p.hero),
    sections: [] as { title: string; layout: Layout; text?: string; photos: number[] }[],
    featured: p.featured,
    order: p.order,
    _status: 'published' as const,
  }
  // по очереди, чтобы общее фото не загрузилось дважды
  for (const s of p.sections) {
    const photos: number[] = []
    for (const name of s.photos) photos.push(await upload(name))
    data.sections.push({ title: s.title, layout: s.layout, text: s.text, photos })
  }
  if (existing) await payload.update({ collection: 'projects', id: existing.id, data })
  else await payload.create({ collection: 'projects', data })
  payload.logger.info(`проект «${p.title}» ${existing ? 'обновлён' : 'создан'}`)
}

process.exit(0)
