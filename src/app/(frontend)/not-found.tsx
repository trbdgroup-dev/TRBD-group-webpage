import { ButtonLink, Label, MoreLink } from '@/components/ui'
import { getVerticals } from '@/lib/payload'

// Branded 404 inside the normal header and footer, with routes back into the site.
export default async function NotFound() {
  const verticals = await getVerticals().catch(() => [])

  return (
    <section className="section bg-white">
      <div className="wrap max-w-[860px]">
        <div className="rule">
          <Label>Error 404</Label>
          <h1 className="mt-3 text-[clamp(34px,4.6vw,56px)] text-navy">Page not found</h1>
          <p className="mt-5 max-w-[34em] text-lg text-muted">
            The page you were looking for has moved or no longer exists. Try one of these instead.
          </p>
          <ButtonLink href="/" className="mt-8">
            Back to the home page
          </ButtonLink>
        </div>
        {verticals.length > 0 ? (
          <nav aria-label="Our verticals" className="mt-14">
            <Label>Our verticals</Label>
            <ul className="mt-5 grid list-none gap-x-8 gap-y-4 p-0 sm:grid-cols-2">
              {verticals.map((vertical) => (
                <li key={vertical.id} className="rule pt-4">
                  <MoreLink href={`/${vertical.slug}`}>{vertical.name}</MoreLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </section>
  )
}
