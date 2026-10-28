import Link from 'next/link'
import type { Contacts } from '@/lib/site/types'

export function Footer({ contacts }: { contacts: Contacts }) {
  const [office1, office2] = contacts.offices
  const phone = contacts.phones[0]?.phone
  return (
    <footer className="ftr wrap">
      <div className="cols">
        {[office1, office2].filter(Boolean).map((o) => (
          <div key={o.city}>
            <p className="fh">{o.city}</p>
            <p>{o.address}</p>
            {o.hours && <p>{o.hours}</p>}
          </div>
        ))}
        <div>
          {phone && (
            <p className="fh">
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
            </p>
          )}
          <p className="lbl">Свяжитесь с нами:</p>
          <Link className="btn s" href="/kviz">
            Написать нам
          </Link>
        </div>
        <div>
          <p className="fh">
            <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
          </p>
          <p className="lbl">Соцсети</p>
          <div className="soc">
            {contacts.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="bot">
        <div>
          <Link href="/soglasie">Согласие на обработку данных</Link>
          <Link href="/politika">Политика конфиденциальности</Link>
        </div>
        <span>© RedONE, {new Date().getFullYear()}</span>
        <span className="rt">
          {contacts.company} ИНН {contacts.inn}
        </span>
      </div>
    </footer>
  )
}
