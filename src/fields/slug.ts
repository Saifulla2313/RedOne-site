import type { TextField } from 'payload'

import { slugify } from '../utilities/slugify'

/** Адрес страницы. Пустой заполняется транслитом из поля-источника. */
export const slugField = (prefix: string, source = 'title'): TextField => ({
  name: 'slug',
  label: 'Адрес страницы',
  type: 'text',
  index: true,
  unique: true,

  admin: {
    position: 'sidebar',
    description: `Адрес: ${prefix}<slug>. Оставьте пустым, заполнится из названия.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const src = data?.[source]
        return typeof src === 'string' && src ? slugify(src) : value
      },
    ],
  },
})
