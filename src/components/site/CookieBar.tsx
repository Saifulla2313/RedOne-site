'use client'

import { useState, useSyncExternalStore } from 'react'

const KEY = 'cookie-ok'

const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}
const accepted = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function CookieBar() {
  // на сервере плашку не рисуем, чтобы не мигала у тех, кто уже согласился
  const wasAccepted = useSyncExternalStore(subscribe, accepted, () => true)
  const [closed, setClosed] = useState(false)
  if (wasAccepted || closed) return null

  const close = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {}
    setClosed(true)
  }
  return (
    <div className="cookie" role="region" aria-label="Cookie">
      <span>
        Мы используем cookie, чтобы сайт работал быстрее и удобнее. Оставаясь на сайте, вы
        соглашаетесь с <a href="/politika">политикой обработки персональных данных</a>.
      </span>
      <button className="btn s" onClick={close}>
        закрыть
      </button>
    </div>
  )
}
