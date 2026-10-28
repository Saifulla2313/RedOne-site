import type { CollectionConfig } from 'payload'

import { contentEditors, hiddenUnless, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'

export const Vacancies: CollectionConfig = {
  slug: 'vacancies',
  labels: { singular: 'Вакансия', plural: 'Вакансии' },
  admin: {
    group: 'Контент',
    useAsTitle: 'title',
    defaultColumns: ['title', 'salaryFrom', 'schedule', '_status'],
    description: '/vakansii/{slug} с разметкой JobPosting для Яндекс Работы.',
    hidden: hiddenUnless('admin', 'editor'),
  },
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: contentEditors, update: contentEditors, delete: contentEditors },
  fields: [
    { name: 'title', label: 'Должность', type: 'text', required: true },
    slugField('/vakansii/'),
    {
      type: 'row',
      fields: [
        { name: 'salaryFrom', label: 'Зарплата от, ₽', type: 'number', min: 0 },
        { name: 'salaryTo', label: 'до, ₽', type: 'number', min: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'schedule',
          label: 'График',
          type: 'select',
          options: [
            { label: 'Полный день', value: 'full' },
            { label: 'Гибкий', value: 'flex' },
            { label: 'Удалённо', value: 'remote' },
          ],
        },
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
    { name: 'description', label: 'Описание', type: 'richText' },
  ],
}
