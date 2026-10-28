import type { LeadType } from './types'

export type LeadPayload = {
  type: LeadType
  phone: string
  name?: string
  answers?: Record<string, string>
}

// Эндпоинт приёма заявок делает каркас админки (коллекция leads).
// Отсюда уходят тип, контакты, ответы, страница и UTM-метки.
export async function sendLead(payload: LeadPayload) {
  const utm = Object.fromEntries(
    [...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith('utm_')),
  )
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, sourcePage: window.location.pathname, utm }),
  })
  if (!res.ok) throw new Error(`lead ${res.status}`)
}

// Оставляем в номере только цифры после +7 и форматируем как +7 (000) 000-00-00
export function formatPhone(input: string) {
  const d = input.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10)
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)]
  let out = ''
  if (parts[0]) out += `(${parts[0]}`
  if (parts[0].length === 3) out += ') '
  if (parts[1]) out += parts[1]
  if (parts[2]) out += `-${parts[2]}`
  if (parts[3]) out += `-${parts[3]}`
  return out
}

export const phoneComplete = (formatted: string) => formatted.replace(/\D/g, '').length === 10
