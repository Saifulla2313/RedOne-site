// Яндекс Метрика на клиенте. Номер счётчика кладёт в window компонент Metrika из layout,
// без счётчика все функции молча ничего не делают.
type Ym = (id: number, method: string, ...args: unknown[]) => void

declare global {
  interface Window {
    ym?: Ym
    __ymId?: number
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (window.__ymId && window.ym) window.ym(window.__ymId, 'reachGoal', goal, params)
}

// ClientID нужен, чтобы связать заявку в админке с визитом в Метрике
export function getClientId(): Promise<string | undefined> {
  const id = window.__ymId
  const ym = window.ym
  if (!id || !ym) return Promise.resolve(undefined)
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), 500)
    ym(id, 'getClientID', (cid: string) => {
      clearTimeout(timer)
      resolve(cid)
    })
  })
}
