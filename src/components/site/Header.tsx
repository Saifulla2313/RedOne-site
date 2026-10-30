'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import type { Media, MenuItem } from '@/lib/site/types'

export function Header({ menu, logo }: { menu: MenuItem[]; logo: Media }) {
  const pathname = usePathname()
  // меню открыто только на той странице, где его открыли: переход по ссылке его закрывает
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

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
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt}
              width={logo.width ?? 120}
              height={logo.height ?? 18}
              style={{ height: 18, width: 'auto' }}
              priority
            />
          ) : (
            // логотип по умолчанию, пока в админке не загружен свой
            <Image
              src="/brand/logo-header.png"
              alt="RED ONE"
              width={482}
              height={131}
              style={{ height: 28, width: 'auto' }}
              priority
            />
          )}
        </Link>
        <div className="r">
          <Link className="btn s" href="/kviz">
            Написать нам
          </Link>
          <Link className="hide-m" href="/#office">
            Офис
          </Link>
          <button
            className="burger"
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
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
          {!menu.some((m) => m.link === '/kontakty') && <Link href="/kontakty">Контакты</Link>}
          <Link href="/kviz">Рассчитать стоимость</Link>
        </nav>
      )}
    </>
  )
}
