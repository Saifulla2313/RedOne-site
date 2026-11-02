'use client'

import { useEffect, useRef } from 'react'

type Props = { url: string; mobileUrl?: string; poster?: string }

// Видео подключаем после загрузки страницы: сначала показывается лёгкий постер,
// а тяжёлый ролик в хорошем качестве не мешает первому экрану и тексту.
export function HeroVideo({ url, mobileUrl, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const start = () => {
      const mobile = mobileUrl && window.matchMedia('(max-width: 767px)').matches
      video.src = mobile ? mobileUrl : url
      video.play().catch(() => {})
    }
    if (document.readyState === 'complete') {
      start()
      return
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [url, mobileUrl])

  return (
    <video
      ref={ref}
      className="hero-bg"
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  )
}
