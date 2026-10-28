'use client'

import { useEffect, useState } from 'react'

const KEY = 'cookie-ok'

export function CookieBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      setShow(!localStorage.getItem(KEY))
    } catch {
      setShow(true)
    }
  }, [])
  if (!show) return null

  const close = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {}
    setShow(false)
  }
  return (
    <div className="cookie" role="region" aria-label="Cookie">
      <span>
        Мы используем cookie, чтобы сайт работал быстрее и удобнее. Оставаясь на сайте, вы соглашаетесь с{' '}
        <a href="/politika">политикой обработки персональных данных</a>.
      </span>
      <button className="btn s" onClick={close}>
        закрыть
      </button>
    </div>
  )
}
