'use client'

import { useId, useState } from 'react'
import { formatPhone, phoneComplete, sendLead } from '@/lib/site/leads'
import type { Media } from '@/lib/site/types'
import { CONSENT_HINT, Consent } from './Consent'
import { Photo } from './Photo'

type State = 'idle' | 'sending' | 'done' | 'error'

export function ExcursionForm({ media }: { media?: Media }) {
  const id = useId()
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [state, setState] = useState<State>('idle')
  const [hint, setHint] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!phoneComplete(phone)) return setHint('Введите номер полностью: 10 цифр после +7')
    if (!agree) return setHint(CONSENT_HINT)
    setHint('')
    setState('sending')
    try {
      await sendLead({ type: 'excursion', phone: `+7 ${phone}` })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <form className="exc rv" onSubmit={submit} noValidate>
      <div className="l">
        <h3>
          {state === 'done'
            ? 'Спасибо! Перезвоним, чтобы выбрать время экскурсии.'
            : 'Запишитесь на экскурсию по готовому объекту'}
        </h3>
        {state !== 'done' && (
          <div>
            <div className="phone">
              <span className="fl" aria-hidden />
              <label htmlFor={`${id}-tel`}>+7</label>
              <input
                id={`${id}-tel`}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(000) 000-00-00"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
              />
              <button className="btn m" disabled={state === 'sending'}>
                {state === 'sending' ? 'Отправляем…' : 'Записаться'}
              </button>
            </div>
            <Consent checked={agree} onChange={setAgree} />
            {(hint || state === 'error') && (
              <p className="err" role="alert">
                {hint || 'Не получилось отправить. Попробуйте ещё раз или позвоните нам.'}
              </p>
            )}
          </div>
        )}
      </div>
      <Photo
        media={media}
        tone={1}
        sizes="(max-width: 900px) 100vw, 455px"
        label="видео: прогулка по объекту"
      />
    </form>
  )
}
