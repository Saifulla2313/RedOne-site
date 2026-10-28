# RedONE — сайт и админка

Next.js 16 + Payload CMS 3.91 + PostgreSQL. Админка живёт в том же приложении по адресу `/admin`.

## Запуск локально

```bash
docker compose up -d          # PostgreSQL
cp .env.example .env          # заполнить PAYLOAD_SECRET
pnpm install
pnpm dev                      # http://localhost:3000/admin
```

При первом входе админка попросит создать пользователя, он становится администратором.

## Структура

| Папка | Что там | Кто ведёт |
|---|---|---|
| `src/collections`, `src/globals`, `src/blocks`, `src/fields`, `src/access` | Схема данных и права | админка |
| `src/endpoints` | `POST /api/leads/submit` — приём заявок с сайта | админка |
| `src/components/admin` | Подсказки и подписи в интерфейсе админки | админка |
| `src/app/(payload)` | Маршруты админки и API (генерирует Payload) | админка |
| `src/app/(frontend)`, `src/components/site`, `src/lib/site` | Публичный сайт | сайт |

Полная схема полей: `docs/admin-schema.md`.

## Роли

- **Администратор** — всё, включая пользователей и интеграции.
- **Редактор контента** — проекты, услуги, ЖК, страницы, статьи, отзывы, медиа, настройки сайта.
- **Менеджер заявок** — заявки; проекты и услуги только смотрит.
- **Автор блога** — свои статьи и медиа, публикует редактор.

## Заявки с сайта

`POST /api/leads/submit`, JSON:

```json
{
  "phone": "+7 900 000-00-00",
  "name": "Ольга",
  "type": "quiz | excursion | consultation | contact | vacancy",
  "channel": "phone | whatsapp | telegram",
  "answers": { "Площадь": "86 м²" },
  "estimate": "270–345 тыс. ₽",
  "sourcePage": "/uslugi/dizajn-interera-kvartiry",
  "utm": { "utm_source": "yandex" },
  "metrikaClientId": "…",
  "captchaToken": "токен SmartCaptcha",
  "website": ""
}
```

Ответ `201 {"ok": true, "id": 1}`, при ошибке `400 {"error": "…"}`. `website` — скрытое поле-ловушка, у людей пустое; заявки ботов сохраняются со статусом «Спам». Заявка пишется в базу, затем уходит в Telegram (`TELEGRAM_BOT_TOKEN` + chat_id в «Интеграциях»). Отправка в Битрикс24 — техдолг.

## Изменение схемы

1. Поменять коллекцию или глобал.
2. `pnpm generate:types` и, если трогали компоненты админки, `pnpm generate:importmap`.
3. `pnpm payload migrate:create <имя>` — в продакшене схема меняется только миграциями, они применяются при старте.

## Тесты

```bash
pnpm test:int    # нужна запущенная база из .env
```
