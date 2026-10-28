import type { CollectionConfig } from 'payload'

import { anyone, hasRole, hiddenUnless } from '../access'

const uploaders = hasRole('admin', 'editor', 'author')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Медиатека' },
  admin: {
    group: 'Файлы',
    useAsTitle: 'alt',
    description: 'Загружайте оригиналы: сайт сам нарежет AVIF/WebP нужных размеров.',
    hidden: hiddenUnless('admin', 'editor', 'author'),
  },
  access: { read: anyone, create: uploaders, update: uploaders, delete: hasRole('admin', 'editor') },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'card', width: 1200, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'wide', width: 2400, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt: что на фото',
      type: 'text',
      required: true,
      admin: { description: 'Обязательно. По нему поисковик понимает, что изображено.' },
    },
    { name: 'caption', label: 'Подпись', type: 'text' },
    {
      name: 'rights',
      label: 'Права на съёмку',
      type: 'select',
      options: [
        { label: 'Съёмка бюро', value: 'own' },
        { label: 'Клиент (есть согласие)', value: 'client' },
        { label: 'Сток', value: 'stock' },
      ],
    },
  ],
}
