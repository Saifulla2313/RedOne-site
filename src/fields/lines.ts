import type { TextareaField } from 'payload'

/** Многострочный список «каждый пункт с новой строки». */
export const linesField = (name: string, label: string): TextareaField => ({
  name,
  label,
  type: 'textarea',
  admin: { description: 'Каждый пункт с новой строки.' },
})
