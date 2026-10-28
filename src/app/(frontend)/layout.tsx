import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Suspense } from 'react'
import { CookieBar } from '@/components/site/CookieBar'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { OfficeSection } from '@/components/site/OfficeSection'
import { Reveal } from '@/components/site/Reveal'
import { getBrand, getContacts, getMenu } from '@/lib/site/data'
import './site.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--f',
  display: 'swap',
})

// Данные меняются в админке, поэтому страницы собираются на каждый запрос (кэш: техдолг #11)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: { default: 'RedONE — дизайн интерьера и архитектура', template: '%s — RedONE' },
  description: '[Описание бюро для поиска: услуги, города, опыт.]',
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menu, brand, contacts] = await Promise.all([getMenu(), getBrand(), getContacts()])
  return (
    <html lang="ru" className={montserrat.variable}>
      <body>
        <Header menu={menu} logo={brand.logo} />
        {children}
        <OfficeSection photos={brand.officeSlider} />
        <Footer contacts={contacts} />
        <CookieBar />
        <Suspense>
          <Reveal />
        </Suspense>
      </body>
    </html>
  )
}
