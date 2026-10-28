import type { GlobalConfig } from 'payload'

import { anyone, contentEditors, hasRole, hiddenUnless, isAdmin } from '../access'
import { linesField } from '../fields/lines'

const settingsAdmin = { group: 'Настройки', hidden: hiddenUnless('admin', 'editor') }

export const Brand: GlobalConfig = {
  slug: 'brand',
  label: 'Бренд и главная',
  admin: { ...settingsAdmin, description: 'Логотип, первый экран, цифры и фото команды, слайдер «Наш офис».' },
  access: { read: anyone, update: contentEditors },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'logo', label: 'Логотип', type: 'upload', relationTo: 'media' },
        { name: 'heroVideo', label: 'Видео первого экрана (до 2 МБ)', type: 'upload', relationTo: 'media' },
        { name: 'heroPoster', label: 'Постер к видео', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'slogan', label: 'Слоган', type: 'text', defaultValue: 'Дизайн интерьера и архитектура' },
    {
      type: 'row',
      fields: [
        { name: 'heroCta', label: 'Кнопка в первом экране', type: 'text', defaultValue: 'Рассчитать стоимость' },
        {
          name: 'heroCtaAction',
          label: 'Что открывает кнопка',
          type: 'select',
          defaultValue: 'quiz',
          options: [
            { label: 'Квиз', value: 'quiz' },
            { label: 'Форма экскурсии', value: 'excursion' },
            { label: 'Страница цен', value: 'prices' },
          ],
        },
      ],
    },
    {
      name: 'stats',
      label: 'Цифры бюро',
      type: 'array',
      maxRows: 6,
      defaultValue: [
        { value: '12', label: 'лет работы' },
        { value: '400+', label: 'проектов' },
        { value: '57', label: 'объектов в работе' },
        { value: '30', label: 'человек в команде' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', label: 'Значение', type: 'text', required: true },
            { name: 'label', label: 'Подпись', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'teamPhoto', label: 'Фото команды', type: 'upload', relationTo: 'media' },
    { name: 'officeSlider', label: 'Слайдер «Наш офис»', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}

export const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: 'Контакты и реквизиты',
  admin: { ...settingsAdmin, description: 'Шапка, футер, /kontakty, разметка Organization.' },
  access: { read: anyone, update: contentEditors },
  fields: [
    {
      name: 'phones',
      label: 'Телефоны',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Подпись', type: 'text' },
            { name: 'phone', label: 'Номер', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'offices',
      label: 'Офисы',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'city', label: 'Город', type: 'text', required: true },
            { name: 'hours', label: 'Часы работы', type: 'text' },
          ],
        },
        { name: 'address', label: 'Адрес', type: 'text', required: true },
        { name: 'mapUrl', label: 'Ссылка на Яндекс Карты', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Почта', type: 'email' },
        { name: 'telegram', label: 'Telegram', type: 'text' },
        { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
      ],
    },
    {
      name: 'socials',
      label: 'Соцсети',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'network',
              label: 'Сеть',
              type: 'select',
              required: true,
              options: [
                { label: 'Telegram-канал', value: 'telegram' },
                { label: 'VK', value: 'vk' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Дзен', value: 'dzen' },
                { label: 'Pinterest', value: 'pinterest' },
              ],
            },
            { name: 'url', label: 'Ссылка', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', label: 'Юрлицо', type: 'text' },
        { name: 'inn', label: 'ИНН', type: 'text' },
        { name: 'ogrn', label: 'ОГРН', type: 'text' },
      ],
    },
  ],
}

export const Menu: GlobalConfig = {
  slug: 'menu',
  label: 'Меню и футер',
  admin: settingsAdmin,
  access: { read: anyone, update: contentEditors },
  fields: [
    {
      name: 'items',
      label: 'Меню в шапке',
      type: 'array',
      defaultValue: [
        { label: 'Проекты', link: '/proekty' },
        { label: 'Услуги', link: '/uslugi' },
        { label: 'Цены', link: '/ceny' },
        { label: 'О студии', link: '/o-studii' },
        { label: 'Блог', link: '/blog' },
        { label: 'Контакты', link: '/kontakty' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Пункт', type: 'text', required: true },
            { name: 'link', label: 'Ссылка', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'cta', label: 'Кнопка в шапке', type: 'text', defaultValue: 'Рассчитать стоимость' },
    { name: 'footerText', label: 'Текст в футере', type: 'textarea' },
  ],
}

export const Quiz: GlobalConfig = {
  slug: 'quiz',
  label: 'Квиз и калькулятор',
  admin: {
    group: 'Настройки',
    hidden: hiddenUnless('admin', 'editor', 'manager'),
    description: 'Шаги квиза и ставки, из которых сайт считает вилку цены: ставка × площадь × коэффициент, −10% / +15%.',
  },
  access: { read: anyone, update: contentEditors },
  fields: [
    {
      name: 'steps',
      label: 'Шаги квиза',
      type: 'array',
      defaultValue: [
        { question: 'Тип объекта', kind: 'options', options: 'Квартира\nДом\nКоммерческое помещение' },
        { question: 'Площадь', kind: 'slider' },
        { question: 'Состояние', kind: 'options', options: 'Бетон\nWhite box\nВторичка' },
        { question: 'Пакет', kind: 'options', options: 'Планировочный\nСтандарт\nПолный' },
        { question: 'Срок', kind: 'options', options: 'В течение месяца\nЧерез 2–3 месяца\nПока присматриваюсь' },
        { question: 'Как с вами связаться', kind: 'contacts' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'question', label: 'Вопрос', type: 'text', required: true },
            {
              name: 'kind',
              label: 'Тип ответа',
              type: 'select',
              required: true,
              options: [
                { label: 'Варианты', value: 'options' },
                { label: 'Ползунок площади', value: 'slider' },
                { label: 'Контакты', value: 'contacts' },
              ],
            },
          ],
        },
        linesField('options', 'Варианты ответа'),
      ],
    },
    {
      name: 'finalText',
      label: 'Текст на последнем шаге',
      type: 'textarea',
      defaultValue: 'Оставьте телефон: пришлём расчёт и подборку проектов вашей площади.',
    },
    {
      name: 'rates',
      label: 'Ставки за м²',
      type: 'array',
      defaultValue: [
        { objectType: 'apartment', pkg: 'planning', rate: 1500 },
        { objectType: 'apartment', pkg: 'standard', rate: 3500 },
        { objectType: 'apartment', pkg: 'full', rate: 5500 },
        { objectType: 'house', pkg: 'standard', rate: 3000 },
        { objectType: 'house', pkg: 'full', rate: 5000 },
        { objectType: 'commercial', pkg: 'standard', rate: 4000 },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'objectType',
              label: 'Объект',
              type: 'select',
              required: true,
              options: [
                { label: 'Квартира', value: 'apartment' },
                { label: 'Дом', value: 'house' },
                { label: 'Коммерческий', value: 'commercial' },
              ],
            },
            {
              name: 'pkg',
              label: 'Пакет',
              type: 'select',
              required: true,
              options: [
                { label: 'Планировочный', value: 'planning' },
                { label: 'Стандарт', value: 'standard' },
                { label: 'Полный', value: 'full' },
              ],
            },
            { name: 'rate', label: 'Ставка, ₽/м²', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
    {
      name: 'conditions',
      label: 'Коэффициенты по состоянию',
      type: 'array',
      defaultValue: [
        { name: 'Бетон', k: 1.1 },
        { name: 'White box', k: 1 },
        { name: 'Вторичка', k: 1.15 },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Состояние', type: 'text', required: true },
            { name: 'k', label: 'Коэффициент', type: 'number', required: true, min: 0.1, max: 5 },
          ],
        },
      ],
    },
  ],
}

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO по умолчанию',
  admin: settingsAdmin,
  access: { read: anyone, update: contentEditors },
  fields: [
    {
      name: 'titleTemplate',
      label: 'Шаблон title',
      type: 'text',
      defaultValue: '{title} — RedONE',
      admin: { description: '{title} подставится из страницы.' },
    },
    {
      name: 'descriptionTemplate',
      label: 'Шаблон description',
      type: 'textarea',
      defaultValue: '{title}. Бюро RedONE: дизайн интерьера и архитектура в Москве и СПб.',
    },
    { name: 'ogDefault', label: 'OG-картинка по умолчанию', type: 'upload', relationTo: 'media' },
    {
      name: 'robots',
      label: 'robots.txt',
      type: 'textarea',
      defaultValue: 'User-agent: *\nDisallow: /admin\nDisallow: /api\nDisallow: /lp/',
    },
    { name: 'yandexVerification', label: 'Код Яндекс Вебмастера', type: 'text' },
  ],
}

export const Integrations: GlobalConfig = {
  slug: 'integrations',
  label: 'Интеграции',
  admin: {
    group: 'Настройки',
    hidden: hiddenUnless('admin'),
    description: 'Куда уходят заявки и чем считается аналитика. Секретные ключи хранятся в переменных окружения сервера.',
  },
  access: { read: isAdmin, update: hasRole('admin') },
  fields: [
    {
      name: 'bitrixNote',
      type: 'ui',
      admin: { components: { Field: '@/components/admin/Note#BitrixNote' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telegramChatId',
          label: 'Telegram-чат для заявок (chat_id)',
          type: 'text',
          admin: { description: 'Токен бота задаётся в TELEGRAM_BOT_TOKEN на сервере.' },
        },
        { name: 'metrikaId', label: 'Номер счётчика Яндекс Метрики', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bitrixWebhook', label: 'Вебхук Битрикс24', type: 'text', admin: { description: 'Пока не используется.' } },
        { name: 'smartCaptchaClientKey', label: 'Клиентский ключ SmartCaptcha', type: 'text' },
      ],
    },
  ],
}

export const globals = [Brand, Contacts, Menu, Quiz, SeoDefaults, Integrations]
