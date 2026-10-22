# Product Manager — cross-cutting

## Scope decisions
- 2026-10-22: Stage 1 (Foundations + landing redesign) ships without the enquiry form. The Contact block shows the company details and an "Email us" mailto link to contact@trbdgroup.com. The form is built in stage 2 (Enquiries) as planned in `tech-stack.md`.
  - Accepted trade-off: no per-vertical routing or enquiry records until stage 2.
- 2026-10-22: Imagery is free stock (Unsplash/Pexels) for launch, about 10–15 images (hero, 1+ per vertical, section breaks). The firm swaps them in the CMS later. Media gets a `credit` field so the source of each stock photo is recorded.
- 2026-10-22: Vertical pages get expanded draft copy written by Claude from the HTML source: overview, one paragraph per service, "how we deliver", 3–5 FAQs. Seeded as Payload drafts flagged "Draft copy — needs review" for the content writer. Nothing fabricated about the firm (no client names, numbers, certifications or claims not in the source).
- 2026-10-22: Visual design approved via `mockups/home-v1.html`: light-only, Source Serif 4 + Public Sans, navy/amber on white/cream. Home order: hero (TRBD intro: label, title, "Explore our verticals" button; five vertical tiles; slideshow only after Explore or a tile click; logo resets) → Who we are → What we do (compact alternating rows) → How we work → Why TRBD → Contact (mailto) → navy footer. No vertical numbering anywhere.
