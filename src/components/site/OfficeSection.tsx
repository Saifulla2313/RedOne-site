'use client'

import { useRef } from 'react'
import type { Media } from '@/lib/site/types'
import { Photo } from './Photo'

export function OfficeSection({ photos }: { photos: Media[] }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
  }
  if (!photos.length) return null

  return (
    <section className="office" id="office">
      <h2 className="big-h rv">Наш офис</h2>
      <div className="slider rv">
        <button className="arr l" aria-label="Назад" onClick={() => scroll(-1)}>
          ‹
        </button>
        <div className="track" ref={track}>
          {photos.map((m, i) => (
            <Photo key={i} media={m} tone={[6, 4, 2][i % 3]} className={i % 2 ? 'sm' : ''} sizes="76vw" label="офис" />
          ))}
        </div>
        <button className="arr r" aria-label="Вперёд" onClick={() => scroll(1)}>
          ›
        </button>
      </div>
    </section>
  )
}
