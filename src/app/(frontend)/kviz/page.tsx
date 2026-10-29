import type { Metadata } from 'next'
import { JsonLd } from '@/components/site/JsonLd'
import { QuizForm } from '@/components/site/QuizForm'
import { getPricing, getQuiz } from '@/lib/site/data'
import { breadcrumbs } from '@/lib/site/schema'
import '../pricing.css'

export const metadata: Metadata = {
  title: 'Расчёт стоимости дизайн-проекта',
  description: 'Ответьте на несколько вопросов и получите расчёт стоимости дизайна интерьера.',
  alternates: { canonical: '/kviz' },
}

export default async function QuizPage() {
  const [quiz, pricing] = await Promise.all([getQuiz(), getPricing()])
  return (
    <main>
      <QuizForm quiz={quiz} pricing={pricing} />
      <JsonLd
        data={breadcrumbs([
          { name: 'Главная', path: '/' },
          { name: 'Расчёт стоимости', path: '/kviz' },
        ])}
      />
    </main>
  )
}
