import type { CollectionConfig } from 'payload'

import { hasRole, hiddenUnless, isAdmin } from '../access'
import { submitLead } from '../endpoints/submitLead'

const staff = hasRole('admin', 'manager')

export const leadTypes = [
  { label: 'Квиз', value: 'quiz' },
  { label: 'Экскурсия', value: 'excursion' },
  { label: 'Консультация', value: 'consultation' },
  { label: 'Обычная форма', value: 'contact' },
  { label: 'Вакансия', value: 'vacancy' },
]

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    group: 'Заявки',
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'phone', 'type', 'status', 'manager'],
    listSearchableFields: ['name', 'phone', 'comment'],
    description:
      'Формы, квиз, экскурсии и вакансии. Заявка сначала сохраняется здесь, потом уходит в Telegram. Битрикс24 подключим позже.',
    hidden: hiddenUnless('admin', 'manager'),
  },
  defaultSort: '-createdAt',
  access: {
    read: staff,
    // Сайт создаёт заявки только через POST /api/leads/submit.
    create: isAdmin,
    update: staff,
    delete: isAdmin,
  },
  endpoints: [{ path: '/submit', method: 'post', handler: submitLead }],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Имя', type: 'text' },
        { name: 'phone', label: 'Телефон', type: 'text', required: true },
        {
          name: 'channel',
          label: 'Как связаться',
          type: 'select',
          options: [
            { label: 'Телефон', value: 'phone' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Telegram', value: 'telegram' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'type', label: 'Источник', type: 'select', required: true, defaultValue: 'contact', options: leadTypes },
        {
          name: 'status',
          label: 'Статус',
          type: 'select',
          required: true,
          defaultValue: 'new',
          index: true,
          options: [
            { label: 'Новая', value: 'new' },
            { label: 'В работе', value: 'in-progress' },
            { label: 'Договор', value: 'contract' },
            { label: 'Отказ', value: 'rejected' },
            { label: 'Спам', value: 'spam' },
          ],
        },
        { name: 'manager', label: 'Менеджер', type: 'relationship', relationTo: 'users' },
      ],
    },
    { name: 'comment', label: 'Комментарий менеджера', type: 'textarea' },
    {
      type: 'collapsible',
      label: 'Ответы квиза и откуда пришла',
      fields: [
        { name: 'answers', label: 'Ответы квиза', type: 'json', admin: { readOnly: true } },
        { name: 'estimate', label: 'Вилка цены, показанная клиенту', type: 'text', admin: { readOnly: true } },
        { name: 'sourcePage', label: 'Страница', type: 'text', admin: { readOnly: true } },
        { name: 'utm', label: 'UTM-метки', type: 'json', admin: { readOnly: true } },
        { name: 'metrikaClientId', label: 'ClientID Метрики', type: 'text', admin: { readOnly: true } },
        {
          type: 'row',
          fields: [
            {
              name: 'consent',
              label: 'Дал согласие на обработку ПД',
              type: 'checkbox',
              admin: { readOnly: true },
            },
            {
              name: 'consentVersion',
              label: 'Редакция согласия',
              type: 'text',
              admin: { readOnly: true, description: 'Дата редакции текста /soglasie на момент заявки.' },
            },
          ],
        },
      ],
    },
    {
      name: 'telegramSent',
      label: 'Отправлена в Telegram',
      type: 'checkbox',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'bitrixSent',
      label: 'Отправлена в Битрикс24',
      type: 'checkbox',
      admin: { readOnly: true, position: 'sidebar', description: 'Интеграция в техдолге.' },
    },
  ],
}
