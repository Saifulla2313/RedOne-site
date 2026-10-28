import Link from 'next/link'
import { fullLabel, priceLabel } from '@/lib/site/pricing'
import type { Pricing } from '@/lib/site/types'

// Прайс в две колонки: «отдельно» и «в пакете FULL», как в PDF
export function PriceTable({ pricing }: { pricing: Pricing }) {
  return (
    <div className="pt-wrap">
      <table className="pt">
        <thead>
          <tr>
            <th scope="col">Услуга</th>
            <th scope="col">Отдельно</th>
            <th scope="col">В пакете {pricing.fullTitle}</th>
          </tr>
        </thead>
        <tbody>
          {pricing.items.map((i) => (
            <tr key={i.title}>
              <th scope="row">
                {i.slug ? <Link href={`/uslugi/${i.slug}`}>{i.title}</Link> : i.title}
              </th>
              <td>{priceLabel(i)}</td>
              <td className={i.inFull === 'gift' ? 'gift' : undefined}>{fullLabel(i)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
