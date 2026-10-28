import type { CollectionConfig } from 'payload'

import { hasRoleField, hiddenUnless, isAdmin, roleOptions } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  admin: {
    group: 'Доступ',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    hidden: hiddenUnless('admin'),
  },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      const user = req.user as { id: number | string; role?: string } | null
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      return { id: { equals: user.id } }
    },
    create: isAdmin,
    update: ({ req }) => {
      const user = req.user as { id: number | string; role?: string } | null
      if (!user) return false
      return user.role === 'admin' ? true : { id: { equals: user.id } }
    },
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Первый пользователь (создаётся при первом входе) становится администратором.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: roleOptions,
      saveToJWT: true,
      access: { create: hasRoleField('admin'), update: hasRoleField('admin') },
    },
  ],
}
