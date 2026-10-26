import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Verticals } from './collections/Verticals'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { env } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: env.NEXT_PUBLIC_SITE_URL,
  routes: {
    admin: '/cms',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(payload)/cms/importMap.js'),
    },
    meta: {
      titleSuffix: ' | TRBD CMS',
    },
  },
  collections: [Pages, Verticals, Media, Users],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Payload owns the `payload` schema; the `app` schema is reserved for Drizzle (ADR-001).
  // Schema changes go through committed migrations, never dev push.
  db: postgresAdapter({
    schemaName: 'payload',
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    pool: {
      connectionString: env.DATABASE_URI,
    },
  }),
  sharp,
  plugins: [
    // Media lives in the public Supabase Storage bucket and is served straight from it.
    // With STORAGE_DRIVER=local (CI, tests) the plugin is off and Payload writes to ./media;
    // alwaysInsertFields keeps the schema, and so the migrations, identical in both modes.
    s3Storage({
      enabled: env.STORAGE_DRIVER === 's3',
      alwaysInsertFields: true,
      bucket: env.S3_BUCKET ?? '',
      config: {
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: env.S3_SECRET_ACCESS_KEY ?? '',
        },
      },
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [env.S3_PUBLIC_URL, prefix, filename].filter(Boolean).join('/'),
        },
      },
    }),
  ],
})
