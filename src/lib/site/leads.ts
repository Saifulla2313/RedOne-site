import { LEGAL_VERSION } from './legal'
import { getClientId, reachGoal } from './metrika'
import type { LeadType } from './types'

export type LeadPayload = {
  type: LeadType
  phone: string
  name?: string
  answers?: Record<string, string>
}

// Отправляем только после отмеченной галочки согласия, поэтому consent всегда true;
// сервер без него заявку не примет.

// Приём заявок: src/endpoints/submitLead.ts (POST /api/leads/submit, ответ 201 или 400 {error}).
// website — поле-ловушка для ботов, люди его не видят, поэтому всегда пустое.
export async function sendLead(payload: LeadPayload) {
  const utm = Object.fromEntries(
    [...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith('utm_')),
  )
  const res = await fetch('/api/leads/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      consent: true,
      consentVersion: LEGAL_VERSION,
      metrikaClientId: await getClientId(),
      channel: 'phone',
      sourcePage: window.location.pathname,
      utm,
      website: '',
    }),
  })
  if (!res.ok) throw new Error(`lead ${res.status}`)
  // цель в Метрике: lead (все заявки) и lead_quiz / lead_excursion по типу формы
  reachGoal('lead', { type: payload.type })
  reachGoal(`lead_${payload.type}`)
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
