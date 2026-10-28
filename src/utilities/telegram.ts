import type { Payload } from 'payload'

import type { Lead } from '../payload-types'

const typeLabel: Record<string, string> = {
  quiz: 'Квиз',
  excursion: 'Экскурсия',
  consultation: 'Консультация',
  contact: 'Форма',
  vacancy: 'Вакансия',
}

const escapeHtml = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)

/** Шлёт заявку в Telegram-чат из «Интеграций». Токен бота берётся из TELEGRAM_BOT_TOKEN. */
export const notifyTelegram = async (payload: Payload, lead: Lead): Promise<boolean> => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return false
  const settings = await payload.findGlobal({ slug: 'integrations', overrideAccess: true })
  const chatId = settings.telegramChatId
  if (!chatId) return false

  const lines = [
    `<b>Новая заявка: ${typeLabel[lead.type] ?? lead.type}</b>`,
    `${escapeHtml(lead.name || 'Без имени')}, ${escapeHtml(lead.phone)}${lead.channel ? ` (${lead.channel})` : ''}`,
  ]
  if (lead.estimate) lines.push(`Вилка: ${escapeHtml(lead.estimate)}`)
  if (lead.answers && typeof lead.answers === 'object' && !Array.isArray(lead.answers)) {
    for (const [k, v] of Object.entries(lead.answers)) lines.push(`${escapeHtml(k)}: ${escapeHtml(String(v))}`)
  }
  if (lead.sourcePage) lines.push(`Страница: ${escapeHtml(lead.sourcePage)}`)
  const base = process.env.NEXT_PUBLIC_SERVER_URL
  if (base) lines.push(`${base}/admin/collections/leads/${lead.id}`)

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
    })
    return res.ok
  } catch (err) {
    payload.logger.error({ err, msg: 'Telegram: заявка не отправлена' })
    return false
  }
}
