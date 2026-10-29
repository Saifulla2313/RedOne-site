'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

// Счётчик Яндекс Метрики. Первый просмотр отправляет сам init, переходы внутри сайта — эффект ниже.
// Вебвизор выключен: он записывает ввод в формы, а это персональные данные (см. техдолг).
export function Metrika({ id }: { id: string }) {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const prev = useRef<string | null>(null)

  useEffect(() => {
    const url = window.location.href
    if (prev.current && prev.current !== url) {
      window.ym?.(Number(id), 'hit', url, { referer: prev.current, title: document.title })
    }
    prev.current = url
  }, [id, pathname, search])

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${id}','ym');
window.__ymId=${id};
ym(${id},'init',{ssr:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
      </Script>
      <noscript>
        <div>
          {/* пиксель для посетителей без JS, next/image тут не нужен */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
