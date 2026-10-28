import type { CollectionConfig } from 'payload'

import { contentEditors, hiddenUnless, publishedOrStaff } from '../access'
import { linesField } from '../fields/lines'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Услуга', plural: 'Услуги и цены' },
  admin: {
    group: 'Услуги',
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceFrom', 'region', '_status', 'updatedAt'],
    description: 'Посадочные страницы /uslugi/{slug} с ценой «от», пакетами, этапами и FAQ.',
    hidden: hiddenUnless('admin', 'editor', 'manager'),
  },
  versions: { drafts: true, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: contentEditors, update: contentEditors, delete: contentEditors },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    slugField('/uslugi/'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'region',
                  label: 'Регион',
                  type: 'select',
                  defaultValue: 'all',
                  options: [
                    { label: 'Москва и СПб', value: 'all' },
                    { label: 'Москва', value: 'moscow' },
                    { label: 'Санкт-Петербург', value: 'spb' },
                  ],
                },
                { name: 'term', label: 'Срок', type: 'text' },
              ],
            },
            { name: 'offer', label: 'Оффер под заголовком', type: 'textarea' },
            { name: 'cover', label: 'Обложка', type: 'upload', relationTo: 'media' },
            {
              name: 'body',
              label: 'Текст страницы',
              type: 'richText',
              admin: { description: '1500–3000 слов полезного текста.' },
            },
          ],
        },
        {
          label: 'Пакеты и цены',
          fields: [
            { name: 'priceFrom', label: 'Цена от, ₽/м²', type: 'number', required: true, min: 0 },
            {
              name: 'packages',
              label: 'Пакеты (таблица сравнения)',
              type: 'array',
              labels: { singular: 'Пакет', plural: 'Пакеты' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Пакет', type: 'text', required: true },
                    { name: 'priceFrom', label: 'Цена от, ₽/м²', type: 'number', min: 0 },
                  ],
                },
                linesField('items', 'Что входит'),
                { name: 'media', label: 'Фото или видео в карточке пакета', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'scope',
              label: 'Состав работ',
              type: 'array',
              labels: { singular: 'Группа работ', plural: 'Группы работ' },
              fields: [{ name: 'label', label: 'Группа', type: 'text', required: true }, linesField('items', 'Пункты')],
            },
          ],
        },
        {
          label: 'Этапы и FAQ',
          fields: [
            {
              name: 'stages',
              label: 'Этапы',
              type: 'array',
              labels: { singular: 'Этап', plural: 'Этапы' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Этап', type: 'text', required: true },
                    { name: 'days', label: 'Срок', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'faq',
              label: 'Вопросы и ответы',
              type: 'array',
              admin: { description: 'Попадают в разметку FAQPage.' },
              labels: { singular: 'Вопрос', plural: 'Вопросы' },
              fields: [
                { name: 'q', label: 'Вопрос', type: 'text', required: true },
                { name: 'a', label: 'Ответ', type: 'textarea', required: true },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
