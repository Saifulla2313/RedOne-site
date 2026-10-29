import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Suspense } from 'react'
import { CookieBar } from '@/components/site/CookieBar'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/site/JsonLd'
import { Metrika } from '@/components/site/Metrika'
import { OfficeSection } from '@/components/site/OfficeSection'
import { Reveal } from '@/components/site/Reveal'
import { getAnalytics, getBrand, getContacts, getMenu } from '@/lib/site/data'
import { organization } from '@/lib/site/schema'
import { siteUrl } from '@/lib/site/url'
import './site.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--f',
  display: 'swap',
})

// Данные меняются в админке, поэтому страницы собираются на каждый запрос (кэш: техдолг #11)
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { yandexVerification } = await getAnalytics()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: 'RedONE — дизайн интерьера и архитектура', template: '%s — RedONE' },
    description:
      'Бюро RedONE: дизайн интерьера, архитектура, комплектация и ремонт под ключ. Пакет FULL — от замера до заселения, авторский надзор и гарантия 5 лет.',
    openGraph: { type: 'website', locale: 'ru_RU', siteName: 'RedONE' },
    // <meta name="yandex-verification">: код из Вебмастера, см. docs/yandex-webmaster.md
    verification: yandexVerification ? { yandex: yandexVerification } : undefined,
    // Пока сайт на тестовом адресе, его можно закрыть от поиска переменной SITE_NOINDEX=1
    robots: process.env.SITE_NOINDEX === '1' ? { index: false, follow: false } : undefined,
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menu, brand, contacts, analytics] = await Promise.all([
    getMenu(),
    getBrand(),
    getContacts(),
    getAnalytics(),
  ])
  return (
    <html lang="ru" className={montserrat.variable}>
      <body>
        <Header menu={menu} logo={brand.logo} />
        {children}
        <OfficeSection photos={brand.officeSlider} />
        <Footer contacts={contacts} />
        <CookieBar />
        <Reveal />
        <JsonLd data={organization(brand, contacts)} />
        {analytics.metrikaId && (
          // useSearchParams в Metrika требует Suspense, иначе страницы перестанут рендериться на сервере
          <Suspense>
            <Metrika id={analytics.metrikaId} />
          </Suspense>
        )}
      </body>
    </html>
  )
}
