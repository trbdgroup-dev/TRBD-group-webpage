import { z } from 'zod'

const S3_KEYS = [
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_BUCKET',
  'S3_PUBLIC_URL',
] as const

// Later stages add their variables here (preview, Sentry, email).
const schema = z
  .object({
    DATABASE_URI: z
      .string()
      .regex(/^postgres(ql)?:\/\//, 'must be a postgres:// or postgresql:// connection string'),
    PAYLOAD_SECRET: z.string().min(32, 'must be at least 32 characters'),
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
    // `s3` = Supabase Storage (local and production); `local` = disk, for CI and tests.
    STORAGE_DRIVER: z.enum(['s3', 'local']).default('local'),
    S3_ENDPOINT: z.url().optional(),
    S3_REGION: z.string().min(1).optional(),
    S3_ACCESS_KEY_ID: z.string().min(1).optional(),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    S3_BUCKET: z.string().min(1).optional(),
    // Public base URL of the bucket, e.g. <supabase>/storage/v1/object/public/media
    S3_PUBLIC_URL: z.url().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.STORAGE_DRIVER !== 's3') return
    for (const key of S3_KEYS) {
      if (!value[key]) {
        ctx.addIssue({ code: 'custom', path: [key], message: 'required when STORAGE_DRIVER=s3' })
      }
    }
  })

export type Env = z.infer<typeof schema>

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source)
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid environment variables:\n${problems}\nSee .env.example.`)
  }
  return result.data
}
