import React from 'react'

const style: React.CSSProperties = {
  background: 'var(--theme-elevation-50)',
  borderRadius: 4,
  padding: '10px 14px',
  marginBottom: 'var(--base)',
  fontSize: 13,
}

export const FeaturedNote = () => (
  <div style={style}>Берутся проекты с флажком «Показывать в „Новых проектах“» по полю «Порядок».</div>
)

export const SimilarNote = () => (
  <div style={style}>
    Похожие проекты подбираются на сайте автоматически: та же услуга, площадь ±20 м², тот же стиль.
  </div>
)

export const BitrixNote = () => (
  <div style={{ ...style, borderLeft: '3px solid var(--theme-warning-500)' }}>
    Отправка заявок в Битрикс24 пока не подключена (техдолг). Все заявки сохраняются в разделе «Заявки» и
    дублируются в Telegram.
  </div>
)
