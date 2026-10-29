import type { Contacts } from './types'

// Дата редакции политики и согласия. Меняйте при каждой правке текста /politika или /soglasie:
// она сохраняется в заявке как доказательство того, с какой редакцией согласился клиент.
export const LEGAL_VERSION = '29.10.2026'

// Заглушки вида «[номер]» в юридическом тексте не показываем
const filled = (v?: string) => (v && !v.includes('[') ? v : '')

export function operator(c: Contacts) {
  const name = filled(c.company) || '[Юрлицо или ИП из раздела «Контакты и реквизиты»]'
  const ids = [filled(c.inn) && `ИНН ${c.inn}`, filled(c.ogrn) && `ОГРН ${c.ogrn}`].filter(Boolean)
  return {
    name,
    full: ids.length ? `${name} (${ids.join(', ')})` : name,
    address: filled(c.legalAddress) || filled(c.offices[0]?.address) || '[юридический адрес]',
    email: filled(c.privacyEmail) || filled(c.email) || '[почта для запросов]',
  }
}
