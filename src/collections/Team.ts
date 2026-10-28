import type { CollectionConfig } from 'payload'

import { anyone, contentEditors, hiddenUnless } from '../access'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Сотрудник', plural: 'Команда' },
  admin: {
    group: 'Контент',
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'showOnSite'],
    description: 'Страница /komanda, авторы статей, команда в проекте.',
    hidden: hiddenUnless('admin', 'editor'),
  },
  access: { read: anyone, create: contentEditors, update: contentEditors, delete: contentEditors },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Имя и фамилия', type: 'text', required: true },
        { name: 'position', label: 'Должность', type: 'text' },
      ],
    },
    { name: 'photo', label: 'Фото', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'years', label: 'Опыт, лет', type: 'number', min: 0 },
        { name: 'order', label: 'Порядок', type: 'number', defaultValue: 100 },
      ],
    },
    { name: 'bio', label: 'О себе', type: 'textarea' },
    { name: 'showOnSite', label: 'Показывать на сайте', type: 'checkbox', defaultValue: true },
  ],
}
