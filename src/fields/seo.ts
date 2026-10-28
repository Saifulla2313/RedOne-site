import type { GroupField } from 'payload'

export const seoField: GroupField = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      maxLength: 70,
      admin: { description: 'До 70 символов. Пусто: подставится шаблон из «SEO по умолчанию».' },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      maxLength: 160,
      admin: { description: '120–160 символов. Без него Яндекс возьмёт случайный кусок текста.' },
    },
    {
      name: 'ogImage',
      label: 'Картинка для соцсетей и мессенджеров (OG)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Пусто: возьмётся обложка.' },
    },
    { name: 'noindex', label: 'Закрыть от индексации (noindex)', type: 'checkbox', defaultValue: false },
  ],
}
