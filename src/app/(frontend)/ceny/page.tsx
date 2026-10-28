import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ExcursionForm } from '@/components/site/ExcursionForm'
import { PriceCalculator } from '@/components/site/PriceCalculator'
import { PriceTable } from '@/components/site/PriceTable'
import { getPricing } from '@/lib/site/data'
import { extraGifts, priceLabel, rates, rub } from '@/lib/site/pricing'
import '../pricing.css'

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPricing()
  const r = rates(p)
  return {
    title: 'Услуги и цены на дизайн интерьера и ремонт',
    description: `Замер, планировка, визуализация, чертежи, инженерия и смета. Пакет ${p.fullTitle}: ${rub(r.full)} ₽/м² вместо ${rub(r.separate)} ₽/м², авторский надзор в подарок.`,
  }
}

export default async function PricesPage() {
  const pricing = await getPricing()
  if (!pricing.items.length) notFound()
  const r = rates(pricing)
  const area = pricing.exampleArea
  const gifts = pricing.items.filter((i) => i.inFull === 'gift')

  return (
    <main className="prices">
      <section className="price-top">
        <h1>Услуги и цены</h1>
      </section>

      <section className="wrap pr-sec">
        <h2 className="pr-h">Прайс-лист</h2>
        <PriceTable pricing={pricing} />
      </section>

      <section className="wrap pr-sec full">
        <h2 className="pr-h">
          Пакет {pricing.fullTitle}
          <small>от замера до заселения</small>
        </h2>
        <p className="lead">{pricing.fullLead}</p>
        <div className="full-nums">
          <p>
            <b>{rub(r.full)} ₽/м²</b>
            <span>
              замеры, проектирование и смета вместо <s>{rub(r.separate)} ₽/м²</s>
            </span>
          </p>
          <p>
            <b>−{rub(r.saving)} ₽</b>
            <span>с каждого квадратного метра</span>
          </p>
          <p>
            <b>{rub(r.full * area)} ₽</b>
            <span>
              для {area} м² вместо {rub(r.separate * area)} ₽
              {extraGifts(pricing).map(
                (g) => ` + ${g.title.toLowerCase()} (${priceLabel(g)}) в подарок`,
              )}
            </span>
          </p>
        </div>
        <h3>В подарок</h3>
        <ul className="gifts">
          {gifts.map((g) => (
            <li key={g.title}>{g.title}</li>
          ))}
        </ul>
        {pricing.team && <p className="lead">{pricing.team}</p>}
        {pricing.conditions.length > 0 && (
          <>
            <h3>Условия пакета</h3>
            <ul className="conds">
              {pricing.conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="wrap pr-sec">
        <h2 className="pr-h">Калькулятор стоимости</h2>
        <PriceCalculator pricing={pricing} />
      </section>

      <ExcursionForm />
    </main>
  )
}
