import { describe, expect, it } from 'vitest'

import { parseEnv } from '@/lib/parse-env'

const valid = {
  DATABASE_URI: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  PAYLOAD_SECRET: 'x'.repeat(32),
}

describe('parseEnv', () => {
  it('accepts a valid environment and defaults the site URL', () => {
    expect(parseEnv(valid)).toEqual({ ...valid, NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' })
  })

  it('rejects a non-postgres database URI', () => {
    expect(() => parseEnv({ ...valid, DATABASE_URI: 'mongodb://localhost/db' })).toThrow(
      /DATABASE_URI/,
    )
  })

  it('rejects a short secret and lists every problem', () => {
    expect(() => parseEnv({ DATABASE_URI: valid.DATABASE_URI, PAYLOAD_SECRET: 'short' })).toThrow(
      /PAYLOAD_SECRET: must be at least 32 characters/,
    )
    expect(() => parseEnv({})).toThrow(/DATABASE_URI[\s\S]*PAYLOAD_SECRET/)
  })

  it('rejects an invalid site URL', () => {
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_SITE_URL: 'not a url' })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    )
  })
})
