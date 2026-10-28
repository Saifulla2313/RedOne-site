'use client'

import { useEffect } from 'react'

// Появление блоков при прокрутке (аналог fadeinup в Tilda).
// Прячем только то, что ниже экрана, поэтому первый экран виден сразу и без JS.
// Один наблюдатель на всё время жизни страницы: новые блоки после переходов ловит MutationObserver.
// Если пересоздавать его на каждый переход, старый успевал пометить блоки новой страницы
// и отключался, и они оставались невидимыми до перезагрузки.
export function Reveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('pre')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    const scan = () =>
      document.querySelectorAll<HTMLElement>('.rv:not([data-rv])').forEach((el) => {
        el.dataset.rv = '1'
        if (el.getBoundingClientRect().top > innerHeight) {
          el.classList.add('pre')
          io.observe(el)
        }
      })
    scan()
    // карточки, которые дорисовались позже (пагинация, вкладки)
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
      document.querySelectorAll('.rv.pre').forEach((el) => el.classList.remove('pre'))
    }
  }, [])

  return null
}
