import type { PayloadHandler } from 'payload'

import { notifyTelegram } from '../utilities/telegram'

const allowedTypes = new Set(['quiz', 'excursion', 'consultation', 'contact', 'vacancy'])
const allowedChannels = new Set(['phone', 'whatsapp', 'telegram'])

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined)

const verifyCaptcha = async (token: string | undefined, ip: string | undefined) => {
  const secret = process.env.SMARTCAPTCHA_SERVER_KEY
  if (!secret) return true // капча ещё не настроена
  if (!token) return false
  const params = new URLSearchParams({ secret, token, ...(ip ? { ip } : {}) })
  try {
    const res = await fetch(`https://smartcaptcha.yandexcloud.net/validate?${params}`)
    const data = (await res.json()) as { status?: string }
    return data.status === 'ok'
  } catch {
    // Сбой капчи не должен терять заявку: сохраняем, менеджер разберётся.
    return true
  }
}

/**
 * POST /api/leads/submit — приём заявки с сайта.
 * Тело: { phone*, name, channel, type, answers, estimate, sourcePage, utm, metrikaClientId, captchaToken, website }
 * `website` — скрытое поле-ловушка для ботов, у людей всегда пустое.
 */
export const submitLead: PayloadHandler = async (req) => {
  const body = (await req.json?.().catch(() => null)) as Record<string, unknown> | null
  if (!body) return Response.json({ error: 'Пустой запрос' }, { status: 400 })

  const phone = str(body.phone, 40)
  const digits = phone?.replace(/\D/g, '') ?? ''
  if (digits.length < 10) return Response.json({ error: 'Укажите телефон' }, { status: 400 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const isBot = Boolean(str(body.website)) || !(await verifyCaptcha(str(body.captchaToken, 2000), ip))

  const type = str(body.type, 30)
  const channel = str(body.channel, 30)
  const lead = await req.payload.create({
    collection: 'leads',
    overrideAccess: true,
    req,
    data: {
      phone: phone as string,
      name: str(body.name, 120),
      channel: channel && allowedChannels.has(channel) ? (channel as 'phone') : undefined,
      type: type && allowedTypes.has(type) ? (type as 'contact') : 'contact',
      status: isBot ? 'spam' : 'new',
      answers: typeof body.answers === 'object' && body.answers ? (body.answers as Record<string, unknown>) : undefined,
      estimate: str(body.estimate, 120),
      sourcePage: str(body.sourcePage, 500),
      utm: typeof body.utm === 'object' && body.utm ? (body.utm as Record<string, unknown>) : undefined,
      metrikaClientId: str(body.metrikaClientId, 64),
    },
  })

  if (!isBot) {
    const sent = await notifyTelegram(req.payload, lead)
    if (sent) {
      await req.payload.update({
        collection: 'leads',
        id: lead.id,
        data: { telegramSent: true },
        overrideAccess: true,
        req,
      })
    }
  }
  // TODO(техдолг #1): отправка в Битрикс24 и отметка bitrixSent.

  return Response.json({ ok: true, id: lead.id }, { status: 201 })
}
