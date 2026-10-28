import { APIError, type Access, type CollectionConfig } from 'payload'

import { hiddenUnless, publishedOrStaff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

type U = { id: number | string; role?: string } | null | undefined

/** Редактор и админ правят всё, автор только свои статьи. */
const ownOrEditor: Access = ({ req }) => {
  const user = req.user as U
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  if (user.role === 'author') return { createdBy: { equals: user.id } }
  return false
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Статья', plural: 'Статьи' },
  admin: {
    group: 'Контент',
    useAsTitle: 'title',
    defaultColumns: ['title', 'rubric', 'author', 'publishedAt', '_status'],
    description: 'Блог /blog/{slug}: статьи и видеообзоры с текстовой версией.',
    hidden: hiddenUnless('admin', 'editor', 'author'),
  },
  versions: { drafts: true, maxPerDoc: 30 },
  access: {
    read: publishedOrStaff,
    create: ({ req }) => ['admin', 'editor', 'author'].includes((req.user as U)?.role ?? ''),
    update: ownOrEditor,
    delete: ownOrEditor,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        const user = req.user as U
        if (operation === 'create' && user && !data.createdBy) data.createdBy = user.id
        if (user?.role === 'author' && data._status === 'published') {
          throw new APIError('Автор не может публиковать. Сохраните черновик, редактор опубликует.', 403, null, true)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Заголовок H1', type: 'text', required: true },
    slugField('/blog/'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Текст',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'rubric',
                  label: 'Рубрика',
                  type: 'select',
                  options: [
                    { label: 'Ремонт', value: 'remont' },
                    { label: 'Планировки', value: 'planirovki' },
                    { label: 'Стили', value: 'stili' },
                    { label: 'Видеообзоры', value: 'video' },
                    { label: 'Новости бюро', value: 'novosti' },
                  ],
                },
                { name: 'author', label: 'Автор', type: 'relationship', relationTo: 'team', required: true },
                { name: 'publishedAt', label: 'Дата публикации', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            { name: 'toc', label: 'Показывать оглавление', type: 'checkbox', defaultValue: true },
            { name: 'cover', label: 'Обложка', type: 'upload', relationTo: 'media' },
            { name: 'videoUrl', label: 'Видео', type: 'text' },
            { name: 'body', label: 'Текст статьи', type: 'richText', required: true },
          ],
        },
        {
          label: 'Связи',
          fields: [
            { name: 'service', label: 'Услуга по теме', type: 'relationship', relationTo: 'services' },
            { name: 'projects', label: 'Проекты по теме', type: 'relationship', relationTo: 'projects', hasMany: true },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    {
      name: 'createdBy',
      label: 'Создал',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
