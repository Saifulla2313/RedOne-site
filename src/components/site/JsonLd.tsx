// Микроразметка schema.org. JSON.stringify не экранирует «</», поэтому заменяем «<» вручную,
// иначе текст из админки мог бы закрыть тег script.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
