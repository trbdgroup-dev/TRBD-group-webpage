import { z } from 'zod'

const S3_KEYS = [
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_BUCKET',
  'S3_PUBLIC_URL',
] as const

/**
 * Why a connection string can't be parsed, without echoing it (it holds the
 * password). Null when it parses. scripts/check-db.mjs mirrors this.
 */
export function connectionStringProblem(uri: string): string | null {
  if (URL.canParse(uri, 'postgres://base')) return null
  const rest = uri.replace(/^[a-z]+:\/\//i, '')
  const at = rest.lastIndexOf('@')
  const userinfo = at === -1 ? '' : rest.slice(0, at)
  const password = userinfo.slice(userinfo.indexOf(':') + 1)
  const special = ['#', '/', '?'].filter((char) => password.includes(char))
  if (special.length > 0) {
    return `the password contains ${special.join(' ')}: percent-encode them (# as %23, / as %2F, ? as %3F) or use a password of letters and numbers only`
  }
  if (/\s/.test(rest.slice(at + 1))) return 'there is a space in the host, port or database name'
  return 'check the host and port (the port must be a number, e.g. 6543)'
}

// Later stages add their variables here (Sentry, email).
const schema = z
  .object({
    DATABASE_URI: z
      .string()
      .regex(/^postgres(ql)?:\/\//, 'must be a postgres:// or postgresql:// connection string')
      .superRefine((value, ctx) => {
        const problem = connectionStringProblem(value)
        if (problem) ctx.addIssue({ code: 'custom', message: `not a valid URL: ${problem}` })
      }),
    // Supabase's CA certificate (PEM text), so the database connection is encrypted
    // and verified where no certificate file exists (Vercel). Pasted with real line
    // breaks or as one line with literal \n sequences; both work.
    DATABASE_CA_CERT: z
      .string()
      .transform((value) => value.replace(/\\n/g, '\n').trim())
      .refine((value) => value.includes('-----BEGIN CERTIFICATE-----'), {
        message: 'must be a PEM certificate (-----BEGIN CERTIFICATE----- ...)',
      })
      .optional(),
    PAYLOAD_SECRET: z.string().min(32, 'must be at least 32 characters'),
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
    // Shared secret on admin preview links (B6); staff sign-in is also required.
    PREVIEW_SECRET: z.string().min(16, 'must be at least 16 characters'),
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
