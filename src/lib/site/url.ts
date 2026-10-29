// Адрес сайта для canonical, sitemap, robots и микроразметки. На хостинге задаётся NEXT_PUBLIC_SERVER_URL.
export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export const absUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`)
