import type { CollectionConfig } from 'payload'

import { contentEditors, hiddenUnless, publishedOrStaff } from '../access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  admin: {
    group: 'Контент',
    useAsTitle: 'client',
    defaultColumns: ['client', 'rating', 'project', 'source', '_status'],
    description: 'Страница /otzyvy, блоки на главной, в услугах и в проекте.',
    hidden: hiddenUnless('admin', 'editor'),
  },
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: contentEditors, update: contentEditors, delete: contentEditors },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'client', label: 'Имя клиента', type: 'text', required: true },
        {
          name: 'rating',
          label: 'Оценка',
          type: 'select',
          defaultValue: '5',
          options: ['5', '4', '3', '2', '1'].map((v) => ({ label: '★'.repeat(Number(v)), value: v })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'project', label: 'Проект', type: 'relationship', relationTo: 'projects' },
        {
          name: 'source',
          label: 'Источник',
          type: 'select',
          defaultValue: 'site',
          options: [
            { label: 'Сайт', value: 'site' },
            { label: 'Яндекс Карты', value: 'yandex-maps' },
            { label: 'Видео', value: 'video' },
          ],
        },
      ],
    },
    { name: 'text', label: 'Текст отзыва', type: 'textarea', required: true },
    { name: 'videoUrl', label: 'Видеоотзыв', type: 'text' },
    { name: 'photo', label: 'Фото клиента', type: 'upload', relationTo: 'media' },
    {
      name: 'consent',
      label: 'Есть письменное согласие клиента на публикацию',
      type: 'checkbox',
      defaultValue: false,
      validate: (value: boolean | null | undefined) =>
        value === true || 'Без письменного согласия клиента отзыв публиковать нельзя (152-ФЗ).',
    },
  ],
}
