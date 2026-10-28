import type { Block } from 'payload'

import { linesField } from '../fields/lines'

const heading = { name: 'heading', label: 'Заголовок', type: 'text' } as const

export const pageBlocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Хиро с видео', plural: 'Хиро с видео' },
    fields: [
      { name: 'heading', label: 'Заголовок H1', type: 'text', required: true },
      { name: 'subheading', label: 'Подзаголовок', type: 'text' },
      { name: 'video', label: 'Видео-фон (mp4/webm до 2 МБ)', type: 'upload', relationTo: 'media' },
      { name: 'poster', label: 'Постер', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    slug: 'stats',
    labels: { singular: 'Цифры бюро', plural: 'Цифры бюро' },
    fields: [
      heading,
      {
        name: 'items',
        label: 'Цифры',
        type: 'array',
        fields: [
          { name: 'value', label: 'Значение', type: 'text', required: true },
          { name: 'label', label: 'Подпись', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    slug: 'directions',
    labels: { singular: 'Направления с ценами', plural: 'Направления с ценами' },
    fields: [heading, { name: 'services', label: 'Услуги', type: 'relationship', relationTo: 'services', hasMany: true }],
  },
  {
    slug: 'featuredProjects',
    labels: { singular: 'Избранные проекты', plural: 'Избранные проекты' },
    fields: [
      heading,
      { name: 'count', label: 'Сколько карточек', type: 'number', defaultValue: 6, min: 1, max: 24 },
      {
        name: 'note',
        type: 'ui',
        admin: { components: { Field: '@/components/admin/Note#FeaturedNote' } },
      },
    ],
  },
  {
    slug: 'steps',
    labels: { singular: 'Этапы работы', plural: 'Этапы работы' },
    fields: [
      heading,
      {
        name: 'items',
        label: 'Этапы',
        type: 'array',
        fields: [
          { name: 'name', label: 'Этап', type: 'text', required: true },
          { name: 'text', label: 'Описание', type: 'textarea' },
        ],
      },
    ],
  },
  {
    slug: 'reviews',
    labels: { singular: 'Отзывы', plural: 'Отзывы' },
    fields: [heading, { name: 'showYandexRating', label: 'Показывать рейтинг Яндекс Карт', type: 'checkbox' }],
  },
  {
    slug: 'excursion',
    labels: { singular: 'Экскурсия по объекту', plural: 'Экскурсия по объекту' },
    fields: [heading, { name: 'text', label: 'Текст', type: 'textarea' }, { name: 'image', label: 'Фото', type: 'upload', relationTo: 'media' }],
  },
  {
    slug: 'faq',
    labels: { singular: 'Вопросы и ответы', plural: 'Вопросы и ответы' },
    fields: [
      heading,
      {
        name: 'items',
        label: 'Вопросы',
        type: 'array',
        fields: [
          { name: 'q', label: 'Вопрос', type: 'text', required: true },
          { name: 'a', label: 'Ответ', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    slug: 'richText',
    labels: { singular: 'Текстовый блок', plural: 'Текстовые блоки' },
    fields: [{ name: 'body', label: 'Текст', type: 'richText' }],
  },
  {
    slug: 'leadForm',
    labels: { singular: 'Форма заявки', plural: 'Формы заявки' },
    fields: [
      heading,
      linesField('bullets', 'Пункты рядом с формой'),
      {
        name: 'leadType',
        label: 'Тип заявки',
        type: 'select',
        defaultValue: 'contact',
        options: [
          { label: 'Обычная форма', value: 'contact' },
          { label: 'Экскурсия', value: 'excursion' },
          { label: 'Консультация', value: 'consultation' },
        ],
      },
    ],
  },
]
