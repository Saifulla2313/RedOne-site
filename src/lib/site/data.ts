// Источник данных для публичных страниц.
// Пока админка (Payload) не в main, функции отдают заглушки с той же формой данных.
// Когда каркас появится, тела функций заменяются на запросы через Payload Local API,
// а сигнатуры остаются прежними (техдолг #6).
import type { Brand, Category, Contacts, MenuItem, Project, ProjectStatus, Quiz, Service } from './types'

const placeholderSections: Project['sections'] = [
  { layout: 'full', photos: [null] },
  { layout: 'full', photos: [null] },
  { title: 'Мастер-спальня', layout: 'vertical', text: '[1–2 предложения о помещении: материалы, свет, хранение.]', photos: [null] },
  { layout: 'cols3', photos: [null, null, null] },
  { title: 'Детская', layout: 'full', photos: [null] },
  { layout: 'cols2', photos: [null, null] },
  { title: 'Прихожая', layout: 'cols2', photos: [null, null] },
]

const raw: [string, string, number, Project['city'], number, ProjectStatus, Category][] = [
  ['penthouse', 'Пентхаус — [название]', 2026, 'moscow', 140, 'done', 'interiors'],
  ['zhk-1', '[Название ЖК]', 2026, 'moscow', 200, 'done', 'interiors'],
  ['zhk-2', '[Название ЖК]', 2026, 'other', 130, 'wip', 'interiors'],
  ['zhk-3', 'ЖК «[Название]»', 2026, 'moscow', 290, 'wip', 'interiors'],
  ['ulica-1', '[Улица]', 2026, 'spb', 220, 'done', 'interiors'],
  ['dom-1', 'Дом в [посёлок]', 2025, 'spb', 1200, 'done', 'architecture'],
  ['zhk-127', '[Название ЖК] 127', 2025, 'moscow', 127, 'done', 'interiors'],
  ['zhk-97', '[Название ЖК] 97', 2025, 'moscow', 97, 'done', 'interiors'],
  ['ulica-2', '[Улица]', 2025, 'moscow', 115, 'wip', 'interiors'],
  ['restoran-1', 'Ресторан «[Название]»', 2024, 'moscow', 310, 'done', 'public'],
]

const projects: Project[] = raw.map(([slug, title, year, city, area, status, category], i) => ({
  slug,
  title,
  year,
  city,
  area,
  status,
  category,
  type: category === 'architecture' ? 'house' : category === 'public' ? 'commercial' : 'apartment',
  cover: null,
  hero: null,
  excerpt:
    '[2–4 предложения о проекте: кто заказчик, какая была задача, какое ключевое решение. Свой текст, 300–500 знаков, с городом и типом объекта для поиска.]',
  videoUrl: i === 0 ? 'placeholder' : undefined,
  sections: placeholderSections,
  featured: i < 6,
  order: i,
}))

export async function getProjects(filter: { category?: Category; status?: ProjectStatus } = {}) {
  return projects
    .filter((p) => !filter.category || p.category === filter.category)
    .filter((p) => !filter.status || p.status === filter.status)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getFeaturedProjects() {
  return projects.filter((p) => p.featured)
}

export async function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null
}

const services: Service[] = [
  {
    slug: 'dizayn-interera',
    title: 'Дизайн интерьера',
    priceFrom: 0,
    cover: null,
    packages: [
      { name: 'Пакет 1', items: ['Обмеры помещения', 'Техническое задание', 'Планировочные решения', 'Визуализации'] },
      {
        name: 'Пакет 2',
        items: ['Обмеры помещения', 'Техническое задание', 'Планировочные решения', 'Визуализации', 'Смета на отделку и мебель', 'Рабочие чертежи'],
      },
      {
        name: 'Пакет 3',
        items: [
          'Обмеры помещения',
          'Техническое задание',
          'Планировочные решения',
          'Визуализации',
          'Полная смета',
          'Рабочие чертежи',
          'Инженерные разделы',
          'Согласование с УК',
        ],
      },
    ],
    scope: [
      { label: 'Альбом проекта', items: ['Техническое задание', 'Обмерный план', 'Планировка с расстановкой мебели', 'Визуализации всех помещений'] },
      {
        label: 'Смета на материалы и мебель',
        items: ['Отопление', 'Сантехника', 'Отделочные материалы', 'Бытовая техника', 'Мебель серийная', 'Мебель на заказ', 'Освещение', 'Двери и перегородки', 'Электрика', 'Декор'],
      },
      {
        label: 'Чертежи',
        items: [
          'Пояснительная записка',
          'Обмерный план',
          'План демонтажа',
          'План монтажа перегородок',
          'План расстановки мебели',
          'План потолков',
          'План полов',
          'План освещения',
          'План розеток и выключателей',
          'Развёртки стен',
        ],
      },
    ],
  },
]

export async function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null
}

export async function getServices() {
  return services
}

export async function getBrand(): Promise<Brand> {
  return {
    logo: null,
    heroVideo: null,
    slogan: 'дизайн / архитектура',
    heroCta: 'Рассчитаем стоимость проекта под вашу площадь',
    heroCtaAction: 'quiz',
    stats: [
      { value: '[N] лет', label: 'Работаем с [год]' },
      { value: '[N] человек', label: 'В команде архитекторов и дизайнеров' },
      { value: '[N]+', label: 'Завершённых объектов' },
      { value: '[N]', label: 'Объектов сейчас в работе' },
    ],
    teamPhoto: null,
    officeSlider: [null, null, null],
  }
}

export async function getContacts(): Promise<Contacts> {
  return {
    phones: [{ phone: '+7 (000) 000-00-00' }],
    offices: [
      { city: 'Москва', address: '[Улица, дом, офис]' },
      { city: '[Второй город]', address: '[Улица, дом, офис]' },
    ],
    email: 'mail@[домен].ru',
    socials: [
      { name: 'VK', url: '#' },
      { name: 'TG', url: '#' },
    ],
    company: '[Юрлицо]',
    inn: '[номер]',
  }
}

export async function getMenu(): Promise<MenuItem[]> {
  return [
    { label: 'Интерьеры', link: '/proekty?category=interiors' },
    { label: 'Архитектура', link: '/proekty?category=architecture' },
    { label: 'Общественные интерьеры', link: '/proekty?category=public' },
    { label: 'Услуги', link: '/uslugi/dizayn-interera' },
    { label: 'Блог', link: '/blog' },
  ]
}

export async function getQuiz(): Promise<Quiz> {
  return {
    intro: 'Ответьте на 4 вопроса и получите расчёт стоимости и подборку материалов в подарок',
    steps: [
      { q: 'Какой объект нужно спроектировать?', kind: 'options', options: ['Квартира', 'Дом', 'Коммерческое помещение'] },
      { q: 'Площадь объекта', kind: 'options', options: ['До 80 m²', '80–150 m²', '150–300 m²', 'Больше 300 m²'] },
      { q: 'Когда планируете начать?', kind: 'options', options: ['В ближайший месяц', 'Через 1–3 месяца', 'Пока присматриваюсь'] },
      { q: 'Какой пакет интересен?', kind: 'options', options: ['Пакет 1', 'Пакет 2', 'Пакет 3', 'Нужна консультация'] },
      { q: 'Куда отправить расчёт?', kind: 'contacts' },
    ],
    final: 'Расчёт пришлём в течение рабочего дня.',
  }
}
