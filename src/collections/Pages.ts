import type { CollectionConfig } from 'payload'

import { contentEditors, hiddenUnless, publishedOrStaff } from '../access'
import { pageBlocks } from '../blocks'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Страница', plural: 'Страницы' },
  admin: {
    group: 'Контент',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Главная, «О студии», «Контакты» и лендинги /lp/: собираются из блоков. Главная — адрес home.',
    hidden: hiddenUnless('admin', 'editor'),
  },
  versions: { drafts: true, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: contentEditors, update: contentEditors, delete: contentEditors },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    slugField('/'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Блоки',
          fields: [
            {
              name: 'layout',
              label: 'Блоки страницы',
              type: 'blocks',
              blocks: pageBlocks,
              admin: {
                initCollapsed: true,
                description: 'Порядок блоков на странице. Вёрстку и скорость обеспечивает код, здесь только содержание.',
              },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
