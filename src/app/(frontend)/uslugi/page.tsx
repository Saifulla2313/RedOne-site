import { redirect } from 'next/navigation'

// Общая страница услуг — прайс на /ceny, отдельные услуги на /uslugi/{slug}
export default function ServicesIndex() {
  redirect('/ceny')
}
