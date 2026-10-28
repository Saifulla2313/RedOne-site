# Схема данных админки RedONE (Payload CMS 3)

Черновик от 2026-10-28, до согласования с Saifulla. Прототип интерфейса: https://claude.ai/artifact/PiEJf9HbrL3YeTK39Ld52L (раздел «Структура и роли»).
Имена полей в коде на английском (в скобках подпись в админке). `*` обязательное.

## Коллекции

**projects** (Проекты), черновики + версии
- title*, slug* (/proekty/{slug}), cover* (upload, 1.8:1, каталог), hero (upload, первый экран проекта), excerpt, task, solution (richText), videoUrl
- category* `interiors | architecture | public` (Интерьеры / Архитектура / Общественные), type* `apartment | house | commercial`, status* `done | wip`
- area* (м²), rooms, year, city `moscow | spb | moscow-region | other`, complex → complexes, style → styles, team → team[] (hasMany), materials[] {item, brand}
- planBefore, planAfter (upload)
- sections[] {title (помещение), layout `full | vertical | cols2 | cols3`, text, photos: upload[] (hasMany)}
- service → services, review → reviews, featured (bool, «Новые проекты»), order (number)
- seo {title, description, ogImage, noindex}

**services** (Услуги и цены), черновики
- title*, slug* (/uslugi/{slug}), region, term, offer, cover, body (richText)
- priceFrom* (₽/м²), packages[] {name, price (₽/м²), items (по строке), media (upload)}
- scope[] {label, items} — «Состав работ»; stages[] {name, days}; faq[] {q, a}; seo

**complexes** (ЖК): title*, slug*, developer, class, district, city, about (richText), notes, layouts (upload[]), seo. noindex, пока нет 1+ проекта и 300+ слов.
**styles**: title*, slug*, description, seo. Индексируется при 4+ проектах.
**pages** (Страницы): title*, slug, layout (blocks: hero, stats, directions, featured, steps, reviews, excursion, faq, text, form), seo.
**articles**: title*, slug*, rubric, author* → team, date, toc, cover, videoUrl, body* (richText), service, projects[], seo.
**reviews**: client*, rating, project, source `site | yandex-maps | video`, text*, videoUrl, consent* (письменное согласие).
**team**: name*, position, photo, years, bio, showOnSite.
**vacancies**: title*, slug, salaryFrom, salaryTo, schedule, city, description.
**media**: file*, alt* (без alt не публикуется проект), caption, rights. Ресайз в AVIF/WebP, хранилище S3 в РФ.
**leads** (Заявки): createdAt, name, phone*, channel `phone | whatsapp | telegram`, type `quiz | excursion | consultation | contact | vacancy`, status `new | in-progress | contract | rejected | spam`, manager → users, answers (json), estimate, sourcePage, utm, metrikaClientId, comment, telegramSent, bitrixSent (техдолг #1).
**users**: name*, email*, role* `admin | editor | manager | author`.

## Глобальные настройки

- **brand** (Бренд и главная): logo, heroVideo (+постер), slogan, heroCta, heroCtaAction `quiz | excursion | prices`, stats[] {value, label}, teamPhoto, officeSlider (upload[])
- **contacts**: phones[] {label, phone}, offices[] {city, address, hours}, telegram, whatsapp, email, socials[] {name, url}, company, inn, ogrn
- **menu**: menu[] {label, link}, cta, footer
- **quiz**: steps[] {q, kind `options | slider | contacts`, options}, final, rates[] {type, pkg, rate ₽/м²}, cond[] {name, k}
- **seo**: titleTemplate, descriptionTemplate, ogDefault, robots
- **integrations** (только admin): telegramChat, metrikaId, crm, bitrixWebhook, smartCaptchaKey

## Роли

| Раздел | admin | editor | manager | author |
|---|---|---|---|---|
| Заявки | полный | — | полный | — |
| Контент, портфолио, услуги, медиа | полный | полный | проекты и услуги: чтение | статьи (свои, без публикации), медиа |
| Настройки (кроме интеграций) | полный | полный | квиз: чтение | — |
| Интеграции, пользователи | полный | — | — | — |
