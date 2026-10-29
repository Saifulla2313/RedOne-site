import config from '@payload-config'
import { getPayload } from 'payload'
import { siteUrl } from '@/lib/site/url'

// robots.txt собираем сами, а не через MetadataRoute.Robots: нужен Clean-param для Яндекса,
// а правила редактируются в админке («SEO по умолчанию» → robots.txt).
export const dynamic = 'force-dynamic'

const DEFAULT_RULES = 'User-agent: *\nDisallow: /admin\nDisallow: /api\nDisallow: /lp/'

// Рекламные и служебные параметры: Яндекс склеит такие адреса с основными и не будет считать дублями
const CLEAN_PARAMS = 'utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid&_openstat&from'

// Поисковые и ответные ИИ-боты. Явная группа нужна, потому что часть из них читает только
// «свою» секцию; правила те же, что для всех: закрыты только админка и API.
const AI_BOTS = [
  'YandexAdditional', // нейроответы Яндекса (Алиса, Поиск с ИИ)
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
]
const AI_RULES = `${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Allow: /
Allow: /api/media/
Disallow: /admin
Disallow: /api`

async function adminRules() {
  try {
    const seo = await (await getPayload({ config })).findGlobal({ slug: 'seo-defaults' })
    return seo.robots?.trim() || DEFAULT_RULES
  } catch {
    return DEFAULT_RULES
  }
}

export async function GET() {
  let rules: string
  if (process.env.SITE_NOINDEX === '1') {
    // тестовый адрес: закрываем всё, чтобы черновой сайт не попал в поиск
    rules = 'User-agent: *\nDisallow: /'
  } else {
    rules = await adminRules()
    // Картинки отдаёт /api/media/file/…: без исключения запрет /api прячет их от Яндекс Картинок
    if (/^Disallow:\s*\/api\/?\s*$/im.test(rules) && !/\/api\/media/i.test(rules)) {
      rules = rules.replace(/^(User-agent:.*)$/im, '$1\nAllow: /api/media/')
    }
    rules += `\n\n${AI_RULES}\n\nClean-param: ${CLEAN_PARAMS}`
  }
  const body = `${rules}\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
