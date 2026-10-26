# Status

**Phase:** 4 — Implementation in progress
**Started:** 2026-10-22

## Inputs
- `tech-stack.md` — agreed stack (final, 21 Oct 2026). Treated as the baseline; changes proposed only where necessary.
- `TRBD Consulting Group.html` — current landing page design and copy (single page: hero, five-vertical tab index, approach, why TRBD, contact form).

## Decomposition (from tech-stack roadmap)
1. Foundations + landing redesign  ← first brainstorm / spec
2. Enquiries (own form, routing, Payload workflow)
3. Registration (Supabase Auth, /account, consent, privacy policy)
4. Manpower module
5. Training module
6. Insights

## Answered
- 2026-10-22: No existing code. Fresh build in this folder; `TRBD Consulting Group.html` is the design and content source. (Stack's "already in place" and "replace Web3Forms" wording is outdated.)
- 2026-10-22: Stage 1 launches without the enquiry form. Contact section shows a mailto link (contact@trbdgroup.com) plus office details; the form, routing and Payload enquiry workflow move to stage 2.
- 2026-10-22: All photos are free stock (Unsplash/Pexels, commercial-use licence) for now; the firm replaces them in Payload later. Each image stored in Payload Media with required alt text, focal point and a credit/source field.
- 2026-10-22: No GitHub/Vercel/Supabase accounts yet. Build locally with git; accounts (in the firm's name) are created and connected before go-live. CI workflow is written now and starts running once the GitHub repo exists.
- 2026-10-22: Package manager npm (pnpm not installed). Docker 27 present, so local Supabase via the Supabase CLI.
- 2026-10-22: Claude drafts expanded copy for each vertical page (overview, a paragraph per service, how we deliver, FAQs) from the HTML content. Seeded into Payload as drafts (not published) and clearly marked for the content writer to refine.
- 2026-10-22: Approach A approved: full Payload content model now (Site Settings, Navigation, Pages with blocks, Verticals, Media, Users; Insights deferred to stage 6). Launch pages: home, five vertical pages, privacy notice.
- 2026-10-22: Design sections 1 (architecture) and 2 (content model) approved.
- 2026-10-22: Section 3 feedback: HTML look rejected as too dark. Light-only site (no dark mode, every visitor sees the same page), >50% of the page bright. No V.01-style numbers anywhere public. Clean, professional, modern. References: AON (full-bleed hero with horizontal row of image cards per topic) and Altman Solon (light background, thin accent rules, small coloured labels, serif headings, alternating text/graphic rows with photo collages). Section 3 revised and re-presented.
- 2026-10-22: Throwaway home page mockup built at `mockups/home-v1.html` (CSS placeholder photos; Source Serif 4 + Public Sans; navy/amber on white/cream; AON-style hero cards; Altman-style alternating vertical rows). Revised after feedback: (1) vertical rows compacted (graphic max 320px, 1.25fr/.75fr columns, tighter padding); (2) hero opens on a TRBD overview slide with an "About TRBD" card before the five vertical cards, labelled "Who we are" / "Our five verticals"; separate intro section folded into the "What we do" header to avoid repeating the hero copy. Further revisions: "What we do" header uses one full-width rule with title under label. Hero intro slide shows only label + title + prominent amber "Explore our verticals" button (no subtitle); About TRBD tile removed (5 vertical tiles). No autoplay on load: the slideshow starts only when the user clicks Explore (opens Manpower) or a tile; the logo returns the hero to the intro state and stops rotation. Slideshow kept as is; a "Who we are" section (white, one full-width rule, label + serif title left, firm description right) added between the hero and "What we do". Section 3 APPROVED 2026-10-22; `mockups/home-v1.html` is the visual reference for the build.
- 2026-10-22: Section 4 (SEO) APPROVED. No live site at trbdgroup.com, so no redirects. Canonical host https://www.trbdgroup.com (apex redirects).
- 2026-10-22: Section 5 (testing, CI, docs) APPROVED. ADRs live in `docs/adr/`; `.10x/adrs/` links there.
- 2026-10-22: Spec written: `.10x/specs/2026-10-22-stage1-foundations-design.md`.
- 2026-10-22: Spec APPROVED by user. Payload 3.91.0 confirmed compatible with Next 16 (peer `>=16.3.3 <17`); pinned next 16.4.2.
- 2026-10-22: Design complete. ADR-001 (table ownership), ADR-002 (access split), ADR-003 (hero behaviour) accepted in `docs/adr/`.
- 2026-10-22: Planning complete. 26 tasks (~12 engineering days) in `decisions/engineering-manager/stage1-foundations.md`; approach per task in `decisions/senior-engineer/stage1-foundations.md`.

## Task progress (stage 1)
- [x] A1 Scaffold · [x] A2 Local Supabase + migrations · [x] A3 Storage spike · [x] A4 Tokens/fonts/shell
- [x] B1 Users + access · [x] B2 Media · [x] B3 Globals · [x] B4 Verticals + slugs · [x] B5 Pages + blocks · [x] B6 Revalidation + preview
- [x] C1 Data layer · [x] C2 heroReducer · [x] C3 HeroSlideshow · [x] C4 Main blocks · [ ] C5 Other blocks + privacy · [ ] C6 Vertical page · [ ] C7 404 + polish
- [ ] D1 Metadata · [ ] D2 Sitemap/robots/JSON-LD · [ ] D3 OG image
- [ ] E1 Draft copy · [x] E2 Photos (approved, downloaded) · [ ] E3 Seed
- [ ] F1 E2E · [ ] F2 CI · [ ] F3 Sentry + Analytics · [ ] F4 Docs

## Open questions

## Blockers
- None.
