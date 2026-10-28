import Image from 'next/image'
import type { Media } from '@/lib/site/types'

type Props = {
  media: Media | undefined
  className?: string
  sizes?: string
  priority?: boolean
  // оттенок заглушки 1–6, пока в админке нет фото
  tone?: number
  label?: string
  children?: React.ReactNode
}

export function Photo({ media, className = '', sizes = '100vw', priority, tone = 1, label, children }: Props) {
  if (media?.url) {
    return (
      <div className={`ph ${className}`}>
        <Image src={media.url} alt={media.alt} fill sizes={sizes} priority={priority} />
        {children}
      </div>
    )
  }
  return (
    <div className={`ph p${((tone - 1) % 6) + 1} ${className}`} data-l={label} role="img" aria-label={label ?? 'Фото'}>
      {children}
    </div>
  )
}
