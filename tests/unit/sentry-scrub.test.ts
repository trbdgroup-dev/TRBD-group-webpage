import type { ErrorEvent } from '@sentry/nextjs'
import { describe, expect, it } from 'vitest'

import {
  redactEmails,
  scrubBreadcrumb,
  scrubEvent,
  scrubText,
  stripQuery,
} from '@/lib/sentry/scrub'

describe('stripQuery', () => {
  it('removes query strings and fragments', () => {
    expect(stripQuery('https://www.trbdgroup.com/preview?secret=abc&path=/')).toBe(
      'https://www.trbdgroup.com/preview',
    )
    expect(stripQuery('/privacy#rights')).toBe('/privacy')
    expect(stripQuery('/oil-gas')).toBe('/oil-gas')
  })
})

describe('redactEmails', () => {
  it('hides email addresses in text, including URL-encoded ones', () => {
    expect(redactEmails('Failed for jane.doe@example.co.in and A@B.COM')).toBe(
      'Failed for [email] and [email]',
    )
    expect(redactEmails('contact=someone%40example.com')).toBe('contact=[email]')
  })
})

describe('scrubText', () => {
  it('strips queries from URLs anywhere in text', () => {
    expect(scrubText('GET /preview?secret=x')).toBe('GET /preview')
    expect(scrubText('fetch https://api.test/v1/a?token=y failed')).toBe(
      'fetch https://api.test/v1/a failed',
    )
    expect(scrubText('no url here?')).toBe('no url here?')
  })
})

describe('scrubEvent', () => {
  const event = (): ErrorEvent =>
    ({
      type: undefined,
      message: 'Lookup failed for someone@example.com',
      user: { id: '7', email: 'someone@example.com', ip_address: '203.0.113.9' },
      request: {
        url: 'https://www.trbdgroup.com/preview?secret=top-secret&path=/manpower',
        method: 'GET',
        query_string: 'secret=top-secret',
        cookies: { 'payload-token': 'jwt' },
        headers: { cookie: 'payload-token=jwt', authorization: 'JWT abc', 'user-agent': 'x' },
        data: { email: 'someone@example.com' },
      },
      exception: { values: [{ type: 'Error', value: 'No user someone@example.com' }] },
      contexts: {
        nextjs: {
          request_path: '/x?secret=top-secret&c=someone%40example.com',
          router_kind: 'App Router',
        },
      },
      tags: { url: 'https://www.trbdgroup.com/x?secret=top-secret' },
      transaction: 'GET /preview?secret=top-secret',
      breadcrumbs: [
        { category: 'navigation', data: { from: '/', to: '/preview?secret=top-secret' } },
        { category: 'fetch', data: { url: '/api/users/me?x=1', method: 'GET' } },
        { category: 'console', message: 'emailed someone@example.com' },
      ],
    }) as ErrorEvent

  it('keeps only the method and query-free URL of the request', () => {
    expect(scrubEvent(event()).request).toEqual({
      method: 'GET',
      url: 'https://www.trbdgroup.com/preview',
    })
  })

  it('removes the user and email addresses', () => {
    const scrubbed = scrubEvent(event())
    expect(scrubbed.user).toBeUndefined()
    expect(scrubbed.message).toBe('Lookup failed for [email]')
    expect(scrubbed.exception?.values?.[0].value).toBe('No user [email]')
  })

  it('strips queries that integrations copy into contexts, tags and the transaction', () => {
    const scrubbed = scrubEvent(event())
    expect(scrubbed.contexts?.nextjs).toEqual({ request_path: '/x', router_kind: 'App Router' })
    expect(scrubbed.tags).toEqual({ url: 'https://www.trbdgroup.com/x' })
    expect(scrubbed.transaction).toBe('GET /preview')
  })

  it('cleans breadcrumbs', () => {
    expect(scrubEvent(event()).breadcrumbs).toEqual([
      { category: 'navigation', data: { from: '/', to: '/preview' } },
      { category: 'fetch', data: { url: '/api/users/me', method: 'GET' } },
      { category: 'console', message: 'emailed [email]' },
    ])
  })

  it('leaves nothing secret anywhere in the event', () => {
    const json = JSON.stringify(scrubEvent(event()))
    for (const secret of [
      'top-secret',
      'someone@example.com',
      'someone%40example.com',
      'jwt',
      '203.0.113.9',
      'JWT abc',
    ]) {
      expect(json).not.toContain(secret)
    }
  })

  it('breadcrumbs without data pass through', () => {
    expect(scrubBreadcrumb({ category: 'ui.click' })).toEqual({ category: 'ui.click' })
  })
})
