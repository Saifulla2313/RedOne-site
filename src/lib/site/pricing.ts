// Расчёты по прайсу. Работают и на сервере, и в калькуляторе на клиенте.
import type { PriceItem, Pricing } from './types'

export const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n))

export function priceLabel(i: PriceItem) {
  if (i.unit === 'm2') return `${rub(i.price)} ₽/м²`
  if (i.unit === 'month') return `${rub(i.price)} ₽/месяц`
  return `${i.price}% ${i.basis ?? ''}`.trim()
}

export const fullLabel = (i: PriceItem) => (i.inFull === 'gift' ? 'В подарок' : priceLabel(i))

const perM2 = (items: PriceItem[]) => items.filter((i) => i.unit === 'm2')
const sum = (items: PriceItem[]) => items.reduce((s, i) => s + i.price, 0)

/** Ставки за м²: все услуги отдельно и они же в пакете FULL. */
export function rates(p: Pricing) {
  const m2 = perM2(p.items)
  const separate = sum(m2)
  const full = sum(m2.filter((i) => i.inFull === 'same'))
  return { separate, full, saving: separate - full }
}

/** Подарки FULL, которые не считаются в ₽/м² (например, авторский надзор). */
export const extraGifts = (p: Pricing) =>
  p.items.filter((i) => i.unit !== 'm2' && i.inFull === 'gift')

/** Сумма за выбранные услуги в ₽/м² для площади. */
export const total = (items: PriceItem[], area: number) => sum(perM2(items)) * area
