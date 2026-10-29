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
      type: 'collapsible',
      label: 'Реквизиты оператора персональных данных',
      admin: {
        description:
          'Подставляются в футер, «Политику конфиденциальности» (/politika), «Согласие на обработку данных» (/soglasie) и микроразметку.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'company',
              label: 'Юрлицо или ИП',
              type: 'text',
              admin: { placeholder: 'ООО «РедВан» или ИП Иванов Иван Иванович' },
            },
            { name: 'inn', label: 'ИНН', type: 'text' },
            { name: 'ogrn', label: 'ОГРН / ОГРНИП', type: 'text' },
          ],
        },
        { name: 'legalAddress', label: 'Юридический адрес', type: 'text' },
        {
          name: 'privacyEmail',
          label: 'Почта для запросов по персональным данным',
          type: 'email',
          admin: { description: 'Пусто: возьмётся основная почта.' },
        },
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
    description: 'Шаги квиза. Расчёт стоимости на шаге «Ползунок площади» сайт берёт из «Прайса».',
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
        {
          question: 'Что нужно',
          kind: 'options',
          options: 'Пакет FULL: проект и ремонт под ключ\nТолько дизайн-проект\nОтдельные услуги\nНужна консультация',
        },
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
  ],
}

export const Pricing: GlobalConfig = {
  slug: 'pricing',
  label: 'Прайс',
  admin: {
    group: 'Услуги',
    hidden: hiddenUnless('admin', 'editor', 'manager'),
    description:
      'Таблица цен на /ceny, пакет FULL и калькулятор в квизе. Считаются только строки в ₽/м².',
  },
  access: { read: anyone, update: contentEditors },
  fields: [
    {
      name: 'items',
      label: 'Услуги',
      type: 'array',
      labels: { singular: 'Услуга', plural: 'Услуги' },
      admin: { initCollapsed: true },
      defaultValue: [
        { title: 'Замер помещения (2 выезда)', unit: 'm2', price: 100, inFull: 'gift' },
        { title: 'Планировочное решение', unit: 'm2', price: 500, inFull: 'gift' },
        { title: 'Визуализация', unit: 'm2', price: 2000, inFull: 'same' },
        { title: 'Чертёжная документация', unit: 'm2', price: 1500, inFull: 'same' },
        { title: 'Инженерная документация', unit: 'm2', price: 1500, inFull: 'gift' },
        { title: 'Смета ремонтных работ', unit: 'm2', price: 1000, inFull: 'gift' },
        {
          title: 'Комплектация',
          unit: 'percent',
          price: 10,
          basis: 'от стоимости закупок',
          inFull: 'same',
        },
        { title: 'Авторский надзор', unit: 'month', price: 50000, inFull: 'gift' },
        {
          title: 'Ведение строительных работ (прораб)',
          unit: 'percent',
          price: 15,
          basis: 'от стоимости работ',
          inFull: 'same',
        },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Услуга', type: 'text', required: true },
            {
              name: 'service',
              label: 'Страница услуги',
              type: 'relationship',
              relationTo: 'services',
              admin: { description: 'Куда ведёт строка таблицы.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'price', label: 'Цена', type: 'number', required: true, min: 0 },
            {
              name: 'unit',
              label: 'Единица',
              type: 'select',
              required: true,
              defaultValue: 'm2',
              options: [
                { label: '₽/м²', value: 'm2' },
                { label: '₽/месяц', value: 'month' },
                { label: '%', value: 'percent' },
              ],
            },
            {
              name: 'basis',
              label: 'База для %',
              type: 'text',
              admin: {
                condition: (_, row) => row?.unit === 'percent',
                placeholder: 'от стоимости работ',
              },
            },
            {
              name: 'inFull',
              label: 'В пакете FULL',
              type: 'select',
              required: true,
              defaultValue: 'same',
              options: [
                { label: 'В подарок', value: 'gift' },
                { label: 'По той же цене', value: 'same' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fullTitle', label: 'Название пакета', type: 'text', defaultValue: 'FULL' },
        {
          name: 'exampleArea',
          label: 'Площадь для примера, м²',
          type: 'number',
          defaultValue: 100,
          min: 1,
        },
      ],
    },
    {
      name: 'fullLead',
      label: 'Описание пакета',
      type: 'textarea',
      defaultValue:
        'Полный комплекс услуг RED ONE: от первых замеров и разработки проекта до комплектации и ведения строительных работ. При заказе пакета FULL пять услуг — в подарок.',
    },
    {
      name: 'team',
      label: 'Кто отвечает за ремонт',
      type: 'textarea',
      defaultValue:
        'За ваш ремонт отвечает команда: менеджер проекта, прораб и закупщик. Ведущий дизайнер сопровождает реализацию проектных решений в рамках авторского надзора.',
    },
    {
      ...linesField('conditions', 'Условия пакета'),
      defaultValue: [
        'Комплектация оплачивается по ставке 10% от стоимости закупок.',
        'Ведение строительных работ — 15% от стоимости работ, погрузки, выгрузки, подъёмов, логистики и уборок. Стоимость строительных материалов в базу расчёта не входит.',
        'Строительные работы, материалы, мебель, техника и сопутствующие расходы оплачиваются отдельно по согласованным сметам.',
        'Подарочные условия действуют при заказе полного комплекса услуг и фиксируются в договоре.',
        'Гарантия на выполненные ремонтно-строительные работы — 5 лет. Условия гарантии закрепляются в договоре.',
      ].join('\n'),
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
    {
      name: 'yandexVerification',
      label: 'Код Яндекс Вебмастера',
      type: 'text',
      admin: {
        description:
          'Только значение content из мета-тега <meta name="yandex-verification" content="…">. Переменная YANDEX_VERIFICATION на сервере важнее.',
      },
    },
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
        {
          name: 'metrikaId',
          label: 'Номер счётчика Яндекс Метрики',
          type: 'text',
          admin: { description: 'Только цифры. Переменная NEXT_PUBLIC_YANDEX_METRIKA_ID на сервере важнее.' },
        },
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

export const globals = [Brand, Contacts, Menu, Quiz, Pricing, SeoDefaults, Integrations]
