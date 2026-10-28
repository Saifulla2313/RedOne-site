import type { CollectionConfig } from 'payload'

import { anyone, contentEditors, hiddenUnless } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Styles: CollectionConfig = {
  slug: 'styles',
  labels: { singular: 'Стиль', plural: 'Стили' },
  admin: {
    group: 'Портфолио',
    useAsTitle: 'title',
    description: 'Страницы /proekty/stil/{slug}. Открываются для поиска, когда в стиле 4+ проекта.',
    hidden: hiddenUnless('admin', 'editor'),
  },
  access: { read: anyone, create: contentEditors, update: contentEditors, delete: contentEditors },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    slugField('/proekty/stil/'),
    { name: 'description', label: 'Описание стиля', type: 'textarea' },
    seoField,
  ],
}
