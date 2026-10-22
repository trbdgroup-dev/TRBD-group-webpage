import { z } from 'zod'

// Later stages add their variables here (storage, preview, Sentry, seeding).
const schema = z.object({
  DATABASE_URI: z
    .string()
    .regex(/^postgres(ql)?:\/\//, 'must be a postgres:// or postgresql:// connection string'),
  PAYLOAD_SECRET: z.string().min(32, 'must be at least 32 characters'),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
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
