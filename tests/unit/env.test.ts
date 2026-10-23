import { describe, expect, it } from 'vitest'

import { parseEnv } from '@/lib/parse-env'

const valid = {
  DATABASE_URI: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  PAYLOAD_SECRET: 'x'.repeat(32),
}

const s3 = {
  STORAGE_DRIVER: 's3',
  S3_ENDPOINT: 'http://127.0.0.1:54321/storage/v1/s3',
  S3_REGION: 'local',
  S3_ACCESS_KEY_ID: 'key',
  S3_SECRET_ACCESS_KEY: 'secret',
  S3_BUCKET: 'media',
  S3_PUBLIC_URL: 'http://127.0.0.1:54321/storage/v1/object/public/media',
}

describe('parseEnv', () => {
  it('accepts a valid environment and applies defaults', () => {
    expect(parseEnv(valid)).toEqual({
      ...valid,
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      STORAGE_DRIVER: 'local',
    })
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

  it('accepts a complete S3 storage configuration', () => {
    expect(parseEnv({ ...valid, ...s3 }).STORAGE_DRIVER).toBe('s3')
  })

  it('requires every S3 variable when STORAGE_DRIVER=s3', () => {
    expect(() => parseEnv({ ...valid, STORAGE_DRIVER: 's3' })).toThrow(
      /S3_ENDPOINT: required[\s\S]*S3_PUBLIC_URL: required/,
    )
    expect(() => parseEnv({ ...valid, ...s3, S3_BUCKET: undefined })).toThrow(/S3_BUCKET/)
  })

  it('rejects an unknown storage driver', () => {
    expect(() => parseEnv({ ...valid, STORAGE_DRIVER: 'ftp' })).toThrow(/STORAGE_DRIVER/)
  })
})
