import type { Metadata } from 'next'
import { QuizForm } from '@/components/site/QuizForm'
import { getQuiz } from '@/lib/site/data'

export const metadata: Metadata = {
  title: 'Расчёт стоимости дизайн-проекта',
  description: 'Ответьте на несколько вопросов и получите расчёт стоимости дизайна интерьера.',
}

export default async function QuizPage() {
  const quiz = await getQuiz()
  return (
    <main>
      <QuizForm quiz={quiz} />
    </main>
  )
}
