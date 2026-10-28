import type { CollectionConfig } from 'payload'

import { contentEditors, hiddenUnless, publishedOrStaff } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Проект', plural: 'Проекты' },
  admin: {
    group: 'Портфолио',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'type', 'area', 'city', 'status', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    description: 'Страницы /proekty/{slug}, каталог с фильтрами, карточки на главной и в услугах.',
    hidden: hiddenUnless('admin', 'editor', 'manager'),
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 30 },
  access: {
    read: publishedOrStaff,
    create: contentEditors,
    update: contentEditors,
    delete: contentEditors,
  },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    slugField('/proekty/'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'cover',
                  label: 'Обложка для каталога',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: { description: 'Горизонтальное 1.8:1, от 2400 px. AVIF/WebP сайт сделает сам.' },
                },
                { name: 'hero', label: 'Главное фото на странице проекта', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'excerpt',
              label: 'Коротко о проекте',
              type: 'textarea',
              admin: { description: 'Под обложкой и в карточке каталога, 1–2 предложения.' },
            },
            { name: 'task', label: 'Задача клиента', type: 'textarea' },
            { name: 'solution', label: 'Решение', type: 'richText' },
            {
              name: 'videoUrl',
              label: 'Видеообзор',
              type: 'text',
              admin: { description: 'Ссылка на Kinescope, VK Видео или Rutube. Плеер грузится только по клику.' },
            },
          ],
        },
        {
          label: 'Паспорт',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  label: 'Раздел сайта',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Интерьеры', value: 'interiors' },
                    { label: 'Архитектура', value: 'architecture' },
                    { label: 'Общественные', value: 'public' },
                  ],
                },
                {
                  name: 'type',
                  label: 'Тип объекта',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Квартира', value: 'apartment' },
                    { label: 'Дом', value: 'house' },
                    { label: 'Коммерческий', value: 'commercial' },
                  ],
                },
                {
                  name: 'status',
                  label: 'Статус объекта',
                  type: 'select',
                  // Своё имя enum: иначе в Postgres совпадает с enum черновиков (_status).
                  enumName: 'enum_projects_build_status',
                  required: true,
                  defaultValue: 'done',
                  options: [
                    { label: 'Реализован', value: 'done' },
                    { label: 'В работе', value: 'wip' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'area', label: 'Площадь, м²', type: 'number', required: true, min: 1 },
                { name: 'rooms', label: 'Комнат', type: 'number', min: 0 },
                { name: 'year', label: 'Год', type: 'number', min: 2000, max: 2100 },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  label: 'Город',
                  type: 'select',
                  options: [
                    { label: 'Москва', value: 'moscow' },
                    { label: 'Санкт-Петербург', value: 'spb' },
                    { label: 'Подмосковье', value: 'moscow-region' },
                    { label: 'Другой', value: 'other' },
                  ],
                },
                { name: 'complex', label: 'ЖК', type: 'relationship', relationTo: 'complexes' },
                { name: 'style', label: 'Стиль', type: 'relationship', relationTo: 'styles' },
              ],
            },
            { name: 'team', label: 'Команда проекта', type: 'relationship', relationTo: 'team', hasMany: true },
            {
              name: 'materials',
              label: 'Материалы и бренды',
              type: 'array',
              labels: { singular: 'Материал', plural: 'Материалы' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'item', label: 'Что', type: 'text', required: true },
                    { name: 'brand', label: 'Бренд', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Фото и планировки',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'planBefore', label: 'Планировка до', type: 'upload', relationTo: 'media' },
                { name: 'planAfter', label: 'Планировка после', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'sections',
              label: 'Разделы страницы по помещениям',
              type: 'array',
              labels: { singular: 'Помещение', plural: 'Помещения' },
              admin: { initCollapsed: true, components: { RowLabel: '@/components/admin/RowLabel#SectionRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', label: 'Помещение', type: 'text', required: true },
                    {
                      name: 'layout',
                      label: 'Раскладка фото',
                      type: 'select',
                      defaultValue: 'full',
                      required: true,
                      options: [
                        { label: 'Во всю ширину', value: 'full' },
                        { label: 'Вертикальные', value: 'vertical' },
                        { label: '2 в ряд', value: 'cols2' },
                        { label: '3 в ряд', value: 'cols3' },
                      ],
                    },
                  ],
                },
                { name: 'text', label: 'Текст', type: 'textarea' },
                { name: 'photos', label: 'Фото', type: 'upload', relationTo: 'media', hasMany: true },
              ],
            },
          ],
        },
        {
          label: 'Связи',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'service', label: 'Услуга', type: 'relationship', relationTo: 'services' },
                { name: 'review', label: 'Отзыв клиента', type: 'relationship', relationTo: 'reviews' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'featured', label: 'Показывать в «Новых проектах» на главной', type: 'checkbox' },
                {
                  name: 'order',
                  label: 'Порядок в каталоге',
                  type: 'number',
                  defaultValue: 100,
                  admin: { description: 'Меньше — выше.' },
                },
              ],
            },
            {
              name: 'similarNote',
              type: 'ui',
              admin: { components: { Field: '@/components/admin/Note#SimilarNote' } },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
