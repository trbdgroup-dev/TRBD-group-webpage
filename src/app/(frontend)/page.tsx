import { ButtonLink, Label, MoreLink, SectionHeader } from '@/components/ui'

// Placeholder until the home page blocks land (C1–C4). Shows the A4 primitives.
export default function HomePage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="wrap py-24">
          <Label tone="light">TRBD Consulting Group</Label>
          <h1 className="mt-4 max-w-[760px] text-[clamp(38px,6vw,72px)]">
            People, skills, energy and markets under one roof
          </h1>
          <ButtonLink href="/#verticals" size="lg" className="mt-8">
            Explore our verticals <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionHeader
            label="Who we are"
            heading="One partner, one point of accountability."
            intro="Site under construction. This placeholder shows the design tokens, fonts and shared components."
          />
        </div>
      </section>
      <section className="section bg-cream" id="verticals">
        <div className="wrap">
          <div className="rule max-w-[560px]">
            <Label>Manpower</Label>
            <h3 className="mt-3 text-[clamp(26px,2.8vw,34px)] text-navy">
              Manpower &amp; Workforce Solutions
            </h3>
            <p className="mt-3.5 text-muted">
              We recruit and deploy skilled, semi-skilled and professional staff for projects at
              home and overseas.
            </p>
            <MoreLink href="/manpower" className="mt-5">
              Learn more
            </MoreLink>
          </div>
        </div>
      </section>
    </>
  )
}
