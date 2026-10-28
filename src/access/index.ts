import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'manager' | 'author'

export const roleOptions: { label: string; value: Role }[] = [
  { label: 'Администратор', value: 'admin' },
  { label: 'Редактор контента', value: 'editor' },
  { label: 'Менеджер заявок', value: 'manager' },
  { label: 'Автор блога', value: 'author' },
]

const roleOf = (req: PayloadRequest): Role | undefined =>
  (req.user as { role?: Role } | null | undefined)?.role

export const hasRole =
  (...roles: Role[]): Access =>
  ({ req }) => {
    const role = roleOf(req)
    return Boolean(role && roles.includes(role))
  }

export const hasRoleField =
  (...roles: Role[]): FieldAccess =>
  ({ req }) => {
    const role = roleOf(req)
    return Boolean(role && roles.includes(role))
  }

/** Скрывает раздел в меню админки для остальных ролей. */
export const hiddenUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }) => {
    const role = (user as { role?: Role } | null)?.role
    return !(role && roles.includes(role))
  }

export const anyone: Access = () => true

/** Опубликованное видят все, черновики только сотрудники. */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const isAdmin = hasRole('admin')
export const contentEditors = hasRole('admin', 'editor')
