'use client'
import { useRowLabel } from '@payloadcms/ui'

export const SectionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{data?.title || `Помещение ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
