import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { RichText } from '@/components/RichText'

// Links typed into CMS rich text must never become script-running hrefs.
const base = { direction: 'ltr', format: '', indent: 0, version: 1 }
const docWithLink = (fields: Record<string, unknown>) =>
  ({
    root: {
      ...base,
      type: 'root',
      children: [
        {
          ...base,
          type: 'paragraph',
          textFormat: 0,
          children: [
            {
              ...base,
              type: 'link',
              fields,
              children: [
                {
                  type: 'text',
                  text: 'click',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                  version: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  }) as never

const hrefOf = (html: string) => html.match(/href="([^"]*)"/)?.[1] ?? null

describe('RichText links', () => {
  it('renders ordinary links', () => {
    const html = renderToStaticMarkup(
      <RichText
        data={docWithLink({ linkType: 'custom', url: 'https://example.com', newTab: false })}
      />,
    )
    expect(hrefOf(html)).toBe('https://example.com')
  })

  for (const url of [
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ]) {
    it(`never outputs a script URL for ${JSON.stringify(url)}`, () => {
      const html = renderToStaticMarkup(
        <RichText data={docWithLink({ linkType: 'custom', url, newTab: false })} />,
      )
      expect(hrefOf(html)).toBe('#')
    })
  }

  it('keeps email, phone, same-site and anchor links', () => {
    for (const url of [
      'mailto:contact@trbdgroup.com',
      'tel:+911234567890',
      '/privacy',
      '#rights',
    ]) {
      const html = renderToStaticMarkup(
        <RichText data={docWithLink({ linkType: 'custom', url })} />,
      )
      expect(hrefOf(html)).toBe(url)
    }
  })

  it('resolves internal links to page and vertical paths', () => {
    const toVertical = renderToStaticMarkup(
      <RichText
        data={docWithLink({
          linkType: 'internal',
          doc: { relationTo: 'verticals', value: { id: 1, slug: 'oil-gas' } },
        })}
      />,
    )
    expect(hrefOf(toVertical)).toBe('/oil-gas')
    const toHome = renderToStaticMarkup(
      <RichText
        data={docWithLink({
          linkType: 'internal',
          doc: { relationTo: 'pages', value: { id: 2, slug: 'home' } },
        })}
      />,
    )
    expect(hrefOf(toHome)).toBe('/')
  })
})
