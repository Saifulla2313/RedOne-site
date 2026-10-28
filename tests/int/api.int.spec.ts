import { createLocalReq, getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { submitLead } from '@/endpoints/submitLead'
import { slugify } from '@/utilities/slugify'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload
let author: { id: number | string; role: string; collection: 'users' }
let teamId: number | string

const lexical = (text: string) => ({
  root: {
    type: 'root',
    version: 1,
    direction: null,
    format: '',
    indent: 0,
    children: [
      { type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }] },
    ],
  },
})

describe('Админка RedONE', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await payload.delete({ collection: 'users', where: { email: { like: '@test.redone' } } })
    // Первый пользователь в базе всегда становится админом, поэтому автор создаётся вторым.
    await payload.create({
      collection: 'users',
      data: { email: `admin-${Date.now()}@test.redone`, password: 'test-pass-123', name: 'Админ', role: 'admin' },
    })
    const u = await payload.create({
      collection: 'users',
      data: { email: `author-${Date.now()}@test.redone`, password: 'test-pass-123', name: 'Автор', role: 'author' },
    })
    author = { ...u, collection: 'users' } as typeof author
    const t = await payload.create({ collection: 'team', data: { name: 'Тестовый автор' } })
    teamId = t.id
  })

  it('первый пользователь становится администратором', async () => {
    const { docs } = await payload.find({ collection: 'users', sort: 'createdAt', limit: 1 })
    expect(docs[0]?.role).toBe('admin')
    expect(author.role).toBe('author')
  })

  it('делает адрес транслитом', () => {
    expect(slugify('Квартира 112 м² в ЖК «Северный парк»')).toBe('kvartira-112-m-v-zhk-severnyj-park')
  })

  it('заполняет slug проекта из названия', async () => {
    const title = `Дом ${Date.now()} в Истре`
    const p = await payload.create({ collection: 'projects', draft: true, data: { title } as never })
    expect(p.slug).toBe(slugify(title))
  })

  it('автор сохраняет черновик статьи, но не публикует', async () => {
    const draft = await payload.create({
      collection: 'articles',
      draft: true,
      overrideAccess: false,
      user: author,
      data: { title: `Черновик ${Date.now()}`, author: teamId, body: lexical('текст') } as never,
    })
    expect(draft._status).toBe('draft')
    expect(draft.createdBy).toBeTruthy()

    await expect(
      payload.update({
        collection: 'articles',
        id: draft.id,
        overrideAccess: false,
        user: author,
        data: { _status: 'published' },
      }),
    ).rejects.toThrow(/Автор не может публиковать/)
  })

  it('не публикует отзыв без согласия клиента', async () => {
    await expect(
      payload.create({ collection: 'reviews', data: { client: 'Ирина', text: 'Отлично', _status: 'published' } }),
    ).rejects.toThrow()
    const ok = await payload.create({
      collection: 'reviews',
      data: { client: 'Ирина', text: 'Отлично', consent: true, _status: 'published' },
    })
    expect(ok._status).toBe('published')
  })

  it('считает слова в описании ЖК', async () => {
    const c = await payload.create({
      collection: 'complexes',
      draft: true,
      data: { title: `ЖК ${Date.now()}`, about: lexical('раз два три четыре') } as never,
    })
    expect(c.wordCount).toBe(4)
  })

  it('принимает заявку с сайта и помечает бота как спам', async () => {
    const call = async (body: Record<string, unknown>) => {
      const req = await createLocalReq({}, payload)
      req.json = async () => body
      req.headers = new Headers()
      return submitLead(req)
    }
    const res = await call({ phone: '+7 900 000-00-01', name: 'Ольга', type: 'quiz', answers: { Площадь: '86 м²' } })
    expect(res.status).toBe(201)
    const { id } = (await res.json()) as { id: number }
    const lead = await payload.findByID({ collection: 'leads', id })
    expect(lead.status).toBe('new')
    expect(lead.type).toBe('quiz')

    const bot = await call({ phone: '+7 900 000-00-02', website: 'http://spam' })
    const botLead = await payload.findByID({ collection: 'leads', id: ((await bot.json()) as { id: number }).id })
    expect(botLead.status).toBe('spam')

    expect((await call({ phone: '123' })).status).toBe(400)
  })

  it('не даёт создать заявку через обычный API без прав', async () => {
    await expect(
      payload.create({ collection: 'leads', overrideAccess: false, data: { phone: '+79000000000', type: 'contact', status: 'new' } }),
    ).rejects.toThrow()
  })
})
