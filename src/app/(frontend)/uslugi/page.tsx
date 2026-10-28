import { notFound, redirect } from 'next/navigation'
import { getServices } from '@/lib/site/data'

// Отдельного списка услуг пока нет: ведём на первую услугу
export default async function ServicesIndex() {
  const [first] = await getServices()
  if (!first) notFound()
  redirect(`/uslugi/${first.slug}`)
}
