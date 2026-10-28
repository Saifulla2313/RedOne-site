'use client'

import { useState } from 'react'
import { extraGifts, priceLabel, rates, rub, total } from '@/lib/site/pricing'
import type { Pricing } from '@/lib/site/types'

const MIN = 20
const MAX = 400

export function AreaInput({ area, onChange }: { area: number; onChange: (n: number) => void }) {
  return (
    <div className="area">
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={Math.min(Math.max(area, MIN), MAX)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Площадь, м²"
      />
      <label className="area-num">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={5000}
          value={area || ''}
          onChange={(e) => onChange(Math.max(0, Math.min(5000, Number(e.target.value) || 0)))}
          aria-label="Площадь, м², числом"
        />
        м²
      </label>
    </div>
  )
}

/** Итог расчёта для площади: отдельно, в FULL и экономия. Используется и в квизе. */
export function Estimate({ pricing, area }: { pricing: Pricing; area: number }) {
  const r = rates(pricing)
  const gifts = extraGifts(pricing)
  return (
    <dl className="est" aria-live="polite">
      <div>
        <dt>Услуги отдельно</dt>
        <dd>
          <s>{rub(r.separate * area)} ₽</s>
        </dd>
      </div>
      <div className="hl">
        <dt>В пакете {pricing.fullTitle}</dt>
        <dd>{rub(r.full * area)} ₽</dd>
      </div>
      <div>
        <dt>Экономия</dt>
        <dd>
          {rub(r.saving * area)} ₽
          {gifts.length > 0 && (
            <small>
              {' '}
              + {gifts.map((g) => `${g.title.toLowerCase()} (${priceLabel(g)})`).join(', ')} в
              подарок
            </small>
          )}
        </dd>
      </div>
    </dl>
  )
}

export function PriceCalculator({ pricing }: { pricing: Pricing }) {
  const m2 = pricing.items.filter((i) => i.unit === 'm2')
  const [area, setArea] = useState(pricing.exampleArea)
  const [picked, setPicked] = useState(() => new Set(m2.map((i) => i.title)))
  const chosen = m2.filter((i) => picked.has(i.title))

  const toggle = (title: string) => {
    const next = new Set(picked)
    if (next.has(title)) next.delete(title)
    else next.add(title)
    setPicked(next)
  }

  return (
    <div className="calc" id="calc">
      <div className="calc-in">
        <h3>Площадь объекта</h3>
        <AreaInput area={area} onChange={setArea} />
        <h3>Услуги</h3>
        <div className="calc-list">
          {m2.map((i) => (
            <label key={i.title} className="chk">
              <input
                type="checkbox"
                checked={picked.has(i.title)}
                onChange={() => toggle(i.title)}
              />
              <span>{i.title}</span>
              <em>{priceLabel(i)}</em>
            </label>
          ))}
        </div>
      </div>
      <div className="calc-out">
        <p className="calc-sum">
          <span>Выбранные услуги</span>
          <b>{rub(total(chosen, area))} ₽</b>
        </p>
        <Estimate pricing={pricing} area={area} />
        <p className="note">
          Комплектация, ведение строительных работ и сами работы считаются отдельно по согласованным
          сметам.
        </p>
        <a className="btn l" href="/kviz">
          Получить точный расчёт
        </a>
      </div>
    </div>
  )
}
