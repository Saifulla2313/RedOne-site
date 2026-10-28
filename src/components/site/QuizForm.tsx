'use client'

import { useState } from 'react'
import { formatPhone, phoneComplete, sendLead } from '@/lib/site/leads'
import { rates, rub } from '@/lib/site/pricing'
import type { Pricing, Quiz } from '@/lib/site/types'
import { AreaInput, Estimate } from './PriceCalculator'

export function QuizForm({ quiz, pricing }: { quiz: Quiz; pricing?: Pricing }) {
  const { steps } = quiz
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [area, setArea] = useState(pricing?.exampleArea ?? 100)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [hint, setHint] = useState('')

  const current = steps[step]
  const last = step === steps.length - 1
  const progress = state === 'done' ? 100 : ((step + 1) / (steps.length + 1)) * 100

  async function next(e: React.FormEvent) {
    e.preventDefault()
    if (current.kind === 'options' && !answers[step]) {
      setAnswers({ ...answers, [step]: current.options?.[0] ?? '' })
    }
    if (current.kind === 'slider' && !area) return setHint('Укажите площадь')
    setHint('')
    if (!last) return setStep(step + 1)
    if (!phoneComplete(phone)) return setHint('Введите номер полностью: 10 цифр после +7')
    setState('sending')
    const r = pricing && rates(pricing)
    const hasArea = steps.some((s) => s.kind === 'slider')
    try {
      await sendLead({
        type: 'quiz',
        name,
        phone: `+7 ${phone}`,
        answers: {
          ...Object.fromEntries(
            steps.flatMap((s, i) =>
              s.kind === 'contacts'
                ? []
                : [
                    [
                      s.q,
                      s.kind === 'slider' ? `${area} м²` : (answers[i] ?? s.options?.[0] ?? ''),
                    ],
                  ],
            ),
          ),
          ...(r && hasArea
            ? {
                'Расчёт на сайте': `отдельно ${rub(r.separate * area)} ₽, в ${pricing.fullTitle} ${rub(r.full * area)} ₽`,
              }
            : {}),
        },
      })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <form className="quiz wrap" onSubmit={next} noValidate>
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Прогресс квиза"
      >
        <i style={{ width: `${progress}%` }} />
      </div>
      <p className="q-sub">{quiz.intro}</p>

      {state === 'done' ? (
        <div className="done">
          <h2>Спасибо!</h2>
          <p>{quiz.final}</p>
        </div>
      ) : (
        <>
          <div className="q-body">
            <h2>{current.q}</h2>
            <div className="opts">
              {current.kind === 'contacts' ? (
                <>
                  <input
                    className="q-in"
                    placeholder="Имя"
                    autoComplete="name"
                    aria-label="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="q-in tel">
                    <span>+7</span>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="(000) 000-00-00"
                      aria-label="Телефон"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                    />
                  </div>
                  <p className="agree-note">
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <a href="/politika">политикой конфиденциальности</a>
                  </p>
                </>
              ) : current.kind === 'slider' ? (
                <>
                  <AreaInput area={area} onChange={setArea} />
                  {pricing && pricing.items.length > 0 && area > 0 && (
                    <Estimate pricing={pricing} area={area} />
                  )}
                </>
              ) : (
                current.options?.map((o, i) => (
                  <label className="opt" key={o}>
                    <input
                      type="radio"
                      name={`q${step}`}
                      value={o}
                      checked={(answers[step] ?? current.options?.[0]) === o}
                      onChange={() => setAnswers({ ...answers, [step]: o })}
                      autoFocus={i === 0}
                    />
                    {o}
                  </label>
                ))
              )}
            </div>
          </div>
          {(hint || state === 'error') && (
            <p className="err q-err" role="alert">
              {hint || 'Не получилось отправить. Попробуйте ещё раз или позвоните нам.'}
            </p>
          )}
          <div className="q-foot">
            <span>
              Шаг {step + 1}/{steps.length}
            </span>
            <div className="nav">
              <button
                type="button"
                className="back"
                aria-label="Назад"
                onClick={() => setStep(step - 1)}
                style={{ visibility: step ? 'visible' : 'hidden' }}
              >
                ←
              </button>
              <button className="btn l" disabled={state === 'sending'}>
                {last ? (state === 'sending' ? 'Отправляем…' : 'Получить расчёт') : 'Далее →'}
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  )
}
