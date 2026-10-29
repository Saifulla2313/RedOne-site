// Галочка согласия под формами заявок. По умолчанию не отмечена: согласие должно быть активным действием.
// Ссылки открываются в новой вкладке, чтобы не терять заполненную форму.
export function Consent({
  checked,
  onChange,
  className = '',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  className?: string
}) {
  return (
    <label className={`agree ${className}`.trim()}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        Я согласен (-а) с{' '}
        <a href="/politika" target="_blank">
          политикой конфиденциальности
        </a>{' '}
        в отношении пользовательских данных и даю свое{' '}
        <a href="/soglasie" target="_blank">
          согласие на обработку персональных данных
        </a>
      </span>
    </label>
  )
}

export const CONSENT_HINT = 'Отметьте согласие на обработку персональных данных'
