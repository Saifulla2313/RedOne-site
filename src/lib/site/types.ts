// Типы публичной части. Повторяют схему админки (/mnt/project-files/max-site/admin-schema.md),
// но только поля, которые нужны страницам сайта.
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type Media = {
  url: string
  alt: string
  width?: number
  height?: number
} | null

export type Seo = {
  title?: string
  description?: string
  ogImage?: Media
  noindex?: boolean
}

export type Category = 'interiors' | 'architecture' | 'public'
export type ProjectStatus = 'done' | 'wip'
export type City = 'moscow' | 'spb' | 'moscow-region' | 'other'
export type SectionLayout = 'full' | 'vertical' | 'cols2' | 'cols3'

export type ProjectSection = {
  title?: string
  layout: SectionLayout
  text?: string
  photos: Media[]
}

export type Project = {
  slug: string
  title: string
  cover: Media
  hero: Media
  excerpt?: string
  videoUrl?: string
  category: Category
  type: 'apartment' | 'house' | 'commercial'
  status: ProjectStatus
  area: number
  year?: number
  city: City
  sections: ProjectSection[]
  featured?: boolean
  order?: number
  seo?: Seo
}

export type Package = {
  name: string
  price?: number
  items: string[]
  media?: Media
}

export type Service = {
  slug: string
  title: string
  priceFrom: number
  offer?: string
  term?: string
  cover?: Media
  // Lexical JSON из админки
  body?: SerializedEditorState | null
  packages: Package[]
  scope: { label: string; items: string[] }[]
  faq: { q: string; a: string }[]
  seo?: Seo
}

export type PriceUnit = 'm2' | 'month' | 'percent'

export type PriceItem = {
  title: string
  price: number
  unit: PriceUnit
  basis?: string
  inFull: 'gift' | 'same'
  slug?: string
}

export type Pricing = {
  items: PriceItem[]
  fullTitle: string
  exampleArea: number
  fullLead: string
  team: string
  conditions: string[]
}

export type Brand = {
  logo: Media
  heroVideo?: { url: string; poster?: Media } | null
  slogan: string
  heroCta: string
  heroCtaAction: 'quiz' | 'excursion' | 'prices'
  stats: { value: string; label: string }[]
  teamPhoto: Media
  officeSlider: Media[]
}

export type Contacts = {
  phones: { label?: string; phone: string }[]
  offices: { city: string; address: string; hours?: string }[]
  email: string
  socials: { name: string; url: string }[]
  company: string
  inn: string
  ogrn: string
  legalAddress: string
  // почта для запросов по персональным данным; пусто в админке — основная почта
  privacyEmail: string
}

export type Analytics = {
  yandexVerification?: string
  metrikaId?: string
}

export type MenuItem = { label: string; link: string }

export type QuizStep = {
  q: string
  kind: 'options' | 'slider' | 'contacts'
  options?: string[]
}

export type Quiz = {
  intro: string
  steps: QuizStep[]
  final: string
}

export type LeadType = 'quiz' | 'excursion' | 'consultation' | 'contact' | 'vacancy'
