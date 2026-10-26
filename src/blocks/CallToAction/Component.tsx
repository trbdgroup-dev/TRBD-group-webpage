import { ButtonLink } from '@/components/ui'
import { linkProps, type CmsLink } from '@/lib/links'
import type { CallToActionBlock as Data } from '@/payload-types'

// A cream strip with a heading, a line of text and one button.
export function CallToActionBlock({ block }: { block: Data }) {
  const button = linkProps(block.button as CmsLink)
  return (
    <section className="bg-cream py-14">
      <div className="wrap flex flex-col items-start gap-6 nav:flex-row nav:items-center nav:justify-between">
        <div className="max-w-[640px]">
          <h2 className="text-[clamp(26px,3vw,36px)] text-navy">{block.heading}</h2>
          {block.text ? <p className="mt-3 text-muted">{block.text}</p> : null}
        </div>
        {button ? <ButtonLink href={button.href}>{block.button?.label}</ButtonLink> : null}
      </div>
    </section>
  )
}
