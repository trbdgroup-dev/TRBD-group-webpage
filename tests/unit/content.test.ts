import { describe, expect, it } from 'vitest'

import { hasRichText, mailtoHref } from '@/lib/content'

const doc = (...children: object[]) => ({ root: { type: 'root', children } })
const para = (text?: string) => ({
  type: 'paragraph',
  children: text === undefined ? [] : [{ type: 'text', text }],
})

describe('hasRichText', () => {
  it('is false for missing or empty editors', () => {
    expect(hasRichText(null)).toBe(false)
    expect(hasRichText(undefined)).toBe(false)
    expect(hasRichText(doc())).toBe(false)
    expect(hasRichText(doc(para()))).toBe(false)
    expect(hasRichText(doc(para('   ')))).toBe(false)
  })

  it('is true when any nested node has text', () => {
    expect(hasRichText(doc(para(), para('Hello')))).toBe(true)
    expect(
      hasRichText(
        doc({
          type: 'list',
          children: [{ type: 'listitem', children: [{ type: 'text', text: 'x' }] }],
        }),
      ),
    ).toBe(true)
  })

  it('counts images and dividers as content', () => {
    expect(hasRichText(doc({ type: 'upload' }))).toBe(true)
    expect(hasRichText(doc({ type: 'horizontalrule' }))).toBe(true)
  })
})

describe('mailtoHref', () => {
  it('builds plain and subject links with encoding', () => {
    expect(mailtoHref('contact@trbdgroup.com')).toBe('mailto:contact@trbdgroup.com')
    expect(mailtoHref('contact@trbdgroup.com', 'Enquiry: Oil & Gas')).toBe(
      'mailto:contact@trbdgroup.com?subject=Enquiry%3A%20Oil%20%26%20Gas',
    )
  })
})
