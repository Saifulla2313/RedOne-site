import Link from 'next/link'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { FeaturedProjects } from '@/components/site/FeaturedProjects'
import { Photo } from '@/components/site/Photo'
import { getBrand, getFeaturedProjects } from '@/lib/site/data'

const ctaHref = {
  quiz: '/kviz',
  excursion: '#excursion',
  prices: '/uslugi/dizayn-interera',
} as const

const directions = [
  { title: 'Дизайн интерьера', href: '/proekty?category=interiors', tone: 2 },
  { title: 'Архитектура', href: '/proekty?category=architecture', tone: 0 },
  { title: 'Общественные интерьеры', href: '/proekty?category=public', tone: 6 },
]

export default async function HomePage() {
  const [brand, featured] = await Promise.all([getBrand(), getFeaturedProjects()])

  return (
    <main>
      <section className="hero">
        {brand.heroVideo?.url ? (
          <video
            className="hero-bg"
            src={brand.heroVideo.url}
            poster={brand.heroVideo.poster?.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Photo
            media={null}
            tone={2}
            className="hero-bg"
            label="фоновое видео: ваш интерьер, 10–15 с"
          />
        )}
        <h1>{brand.slogan}</h1>
        <div className="hero-cta">
          <span>{brand.heroCta}</span>
          <Link className="btn dark m" href={ctaHref[brand.heroCtaAction]}>
            Оставить заявку
          </Link>
        </div>
      </section>

      <h2 className="sec-h rv">Новые проекты</h2>
      <FeaturedProjects projects={featured} />

      <section className="team rv">
        <Photo
          media={brand.teamPhoto}
          tone={5}
          className="bw"
          sizes="100vw"
          label="общее фото команды, ч/б"
        />
        <div className="stats">
          {brand.stats.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <h2>{brand.slogan}</h2>
      </section>
      <div className="dirs rv">
        {directions.map((d) => (
          <Link key={d.title} className={`dir${d.tone ? '' : ' empty'}`} href={d.href}>
            <Photo media={null} tone={d.tone || 1} />
            <h4>{d.title}</h4>
            <span className="go">Смотреть портфолио</span>
          </Link>
        ))}
      </div>

      <div id="excursion">
        <ExcursionForm />
      </div>
    </main>
  )
}
