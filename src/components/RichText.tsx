import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { pagePath } from '@/lib/slugs'

// Renders Lexical rich text from the CMS. Internal links to pages and verticals
// resolve to their public paths; styling comes from the `.rich-text` rules in
// globals.css so editors' headings, lists and links match the site.

function internalDocToHref({ linkNode }: { linkNode: SerializedLinkNode }) {
  const doc = linkNode.fields.doc
  const slug = doc?.value && typeof doc.value === 'object' ? doc.value.slug : null
  if (typeof slug !== 'string' || !slug) return '#'
  return doc?.relationTo === 'verticals' ? `/${slug}` : pagePath(slug)
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

export function RichText({
  data,
  className = '',
}: {
  data: SerializedEditorState | null | undefined
  className?: string
}) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data}
      converters={converters}
      disableContainer={false}
      className={`rich-text ${className}`}
    />
  )
}
