// Логотип на странице входа в админку. Payload ставит data-theme на <html>,
// поэтому держим оба варианта и показываем подходящий теме.
export function Logo() {
  return (
    <>
      <style>{`.ro-logo{height:140px;width:auto}html[data-theme='dark'] .ro-logo.dark,html:not([data-theme='dark']) .ro-logo.light{display:none}`}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ro-logo dark" src="/brand/logo-stack-dark.png" alt="RED ONE" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ro-logo light" src="/brand/logo-stack-white.png" alt="RED ONE" />
    </>
  )
}

// Значок в меню админки
export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/icon.png" alt="RED ONE" style={{ height: 22, width: 'auto' }} />
}
