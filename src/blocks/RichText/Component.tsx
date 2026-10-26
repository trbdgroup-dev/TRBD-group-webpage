import { RichText } from '@/components/RichText'
import type { RichTextBlock as Data } from '@/payload-types'

// Long-form text in a readable column, e.g. the privacy notice.
export function RichTextBlock({ block }: { block: Data }) {
  return (
    <section className="bg-white pb-16 pt-4 sm:pb-24">
      <div className="wrap">
        <RichText data={block.body} className="max-w-[720px]" />
      </div>
    </section>
  )
}
