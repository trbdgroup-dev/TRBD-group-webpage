import type { SerializedAutoLinkNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { safeHref } from '@/lib/links'
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

const linkConverters = LinkJSXConverter({ internalDocToHref })

type LinkLike = SerializedLinkNode | SerializedAutoLinkNode
type ConverterFn = (args: { node: LinkLike } & Record<string, unknown>) => React.ReactNode

/** Runs Payload's link converter on a copy of the node whose URL has passed safeHref. */
const withSafeUrl =
  (converter: unknown): ConverterFn =>
  (args) => {
    const node = args.node
    const fields = { ...node.fields, url: safeHref(node.fields.url) }
    return (converter as ConverterFn)({ ...args, node: { ...node, fields } as LinkLike })
  }

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...linkConverters,
  link: withSafeUrl(linkConverters.link),
  autolink: withSafeUrl(linkConverters.autolink),
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
