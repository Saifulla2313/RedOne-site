import type { CollectionConfig } from 'payload'

import { contentEditors, hiddenUnless, publishedOrStaff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { countWords } from '../utilities/countWords'

export const Complexes: CollectionConfig = {
  slug: 'complexes',
  labels: { singular: 'ЖК', plural: 'ЖК' },
  admin: {
    group: 'Портфолио',
    useAsTitle: 'title',
    defaultColumns: ['title', 'class', 'district', 'wordCount', '_status'],
    description:
      'Страницы /zhk/{slug}. Сайт закрывает страницу от индексации, пока в ЖК нет проекта или о нём меньше 300 слов.',
    hidden: hiddenUnless('admin', 'editor'),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: contentEditors, update: contentEditors, delete: contentEditors },
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.wordCount = countWords(data.about)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Название ЖК', type: 'text', required: true },
    slugField('/zhk/'),
    {
      type: 'row',
      fields: [
        { name: 'developer', label: 'Девелопер', type: 'text' },
        {
          name: 'class',
          label: 'Класс',
          type: 'select',
          options: [
            { label: 'Комфорт', value: 'comfort' },
            { label: 'Бизнес', value: 'business' },
            { label: 'Премиум', value: 'premium' },
            { label: 'Элит', value: 'elite' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'district', label: 'Район', type: 'text' },
        {
          name: 'city',
          label: 'Город',
          type: 'select',
          defaultValue: 'moscow',
          options: [
            { label: 'Москва', value: 'moscow' },
            { label: 'Санкт-Петербург', value: 'spb' },
          ],
        },
      ],
    },
    {
      name: 'about',
      label: 'О ЖК',
      type: 'richText',
      admin: { description: 'Нужно 300+ слов уникального текста, иначе страница закрыта от индексации.' },
    },
    { name: 'notes', label: 'Нюансы отделки и согласований с УК', type: 'textarea' },
    { name: 'layouts', label: 'Типовые планировки', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'wordCount',
      label: 'Слов в описании',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
    seoField,
  ],
}
