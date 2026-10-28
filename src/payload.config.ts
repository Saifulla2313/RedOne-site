import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Complexes } from './collections/Complexes'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Reviews } from './collections/Reviews'
import { Services } from './collections/Services'
import { Styles } from './collections/Styles'
import { Team } from './collections/Team'
import { Users } from './collections/Users'
import { Vacancies } from './collections/Vacancies'
import { globals } from './globals'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — RedONE', title: 'Админка RedONE' },
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'd MMMM yyyy, HH:mm',
  },
  i18n: { supportedLanguages: { ru }, fallbackLanguage: 'ru' },
  collections: [Leads, Projects, Complexes, Styles, Services, Pages, Articles, Reviews, Team, Vacancies, Media, Users],
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // В продакшене схема меняется только миграциями (pnpm payload migrate).
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
