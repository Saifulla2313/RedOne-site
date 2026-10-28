'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Media, MenuItem } from '@/lib/site/types'

export function Header({ menu, logo }: { menu: MenuItem[]; logo: Media }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header className="hdr">
        <nav aria-label="Разделы">
          {menu.map((m) => (
            <Link key={m.link} href={m.link}>
              {m.label}
            </Link>
          ))}
        </nav>
        <Link className="logo" href="/" aria-label="RedONE, на главную">
          {logo?.url ? <img src={logo.url} alt={logo.alt} height={18} /> : 'RedONE'}
        </Link>
        <div className="r">
          <Link className="btn s" href="/kviz">
            Написать нам
          </Link>
          <Link className="hide-m" href="/#office">
            Офис
          </Link>
          <button className="burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)}>
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>
      {open && (
        <nav className="mmenu" aria-label="Меню">
          {menu.map((m) => (
            <Link key={m.link} href={m.link}>
              {m.label}
            </Link>
          ))}
          <Link href="/kviz">Рассчитать стоимость</Link>
        </nav>
      )}
    </>
  )
}
