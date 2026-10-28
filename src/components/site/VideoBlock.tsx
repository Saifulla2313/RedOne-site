'use client'

import { useState } from 'react'
import type { Media } from '@/lib/site/types'
import { Photo } from './Photo'

// Обложка с кнопкой play: видео грузится только по клику
export function VideoBlock({ url, poster }: { url: string; poster?: Media }) {
  const [playing, setPlaying] = useState(false)
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(url)

  if (playing && isFile) return <video className="vid" src={url} controls autoPlay playsInline />
  if (playing) return <iframe className="vid" src={url} allow="autoplay; fullscreen" allowFullScreen title="Видео-обзор" />

  return (
    <Photo media={poster} tone={1} sizes="(max-width: 900px) 100vw, 1080px" label="видео-обзор объекта">
      <button className="play" aria-label="Смотреть видео" onClick={() => setPlaying(true)} disabled={url === 'placeholder'} />
    </Photo>
  )
}
