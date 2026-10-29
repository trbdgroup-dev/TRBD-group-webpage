# ADR-003: Home hero opens on a TRBD intro; the vertical slideshow starts on user action or after a visible countdown

**Status:** Accepted
**Date:** 2026-10-22
**Feature:** stage1-foundations
**Author:** 10x-Team (Architect + Staff Engineer)

## Context

The approved design takes inspiration from AON's hero (full-bleed photo with a row of image tiles). The client wants visitors introduced to TRBD before the verticals and does not want the slideshow running while visitors simply scroll past. The hero holds the LCP image, so it must stay fast; it must meet WCAG 2.2.2 (Pause, Stop, Hide); and search engines must be able to read it.

## Decision

- **Server-rendered:** the intro and all five vertical slides are in the HTML. The intro title is the page's only `h1`; slide headlines are `h2`. Inactive slides use `hidden`, which removes them from view and from the accessibility tree.
- **States:** `intro` on load, with no rotation. `slideshow(i)` is entered by "Explore our verticals" (i = Manpower) or a tile click (i = that tile). It rotates every 7 s, pauses on hover and while focus is inside, has a visible pause/play button, and never auto-advances under `prefers-reduced-motion: reduce`. Clicking the header logo returns to `intro`, stops rotation and scrolls to the top.
- **Implementation:** one small client component (`HeroSlideshow`) driven by a pure reducer (`heroReducer`), so the state logic is unit-tested without a browser. No carousel library.
- Only the intro background loads eagerly (`priority`). Vertical images load lazily and are preloaded on first hover or focus of the tile row.

## Alternatives Considered

| Alternative                      | Pros                            | Cons                                                         | Why Not            |
| -------------------------------- | ------------------------------- | ------------------------------------------------------------ | ------------------ |
| Autoplay on load (AON default)   | Shows every vertical unprompted | Distracts readers; accessibility burden                      | Client rejected it |
| Carousel library (Embla, Swiper) | Swipe and a11y helpers          | Extra JS for behaviour we control in about 100 lines         | Unneeded weight    |
| Client-only rendering of slides  | Simpler component               | Slide text invisible to crawlers until JS runs; layout shift | Hurts SEO and LCP  |

## Consequences

### Positive

- A calm first impression, accessible by default, testable logic, minimal JavaScript.

### Negative

- Visitors who never interact never see the slideshow; the "What we do" rows cover the verticals for them.

### Risks

- Vertical images flash on the first switch. Mitigation: preload on first hover or focus of the tiles.

## Amendment (2026-10-29): timed start and filling tiles

At the client's request the intro now starts the slideshow by itself, with visible timers:

- **Intro:** the "Explore our verticals" button starts faded (outlined) and fills with amber from left to right over 6 s; when it is full the slideshow opens on Manpower. This happens once per visit: after the logo returns to the intro, it waits for a click. Keyboard focus inside the hero or the pause button (now also shown during the countdown) holds the fill. Hovering doesn't, because the pointer often rests on the large hero.
- **Tiles:** every tile except the current slide's is faded (dimmed and greyscale). The next slide's tile clears from left to right over the 7 s rotation, and the slide changes when it is clear. Hover, focus and pause freeze the fill and the timer together, since the slide changes on the fill's `animationend` rather than on a separate timer.
- **Reduced motion:** unchanged in spirit. No fills, no automatic start, no rotation; the Explore button shows filled.
- **Accessibility:** the moving fill lasts over 5 s, so WCAG 2.2.2 applies: the visible pause button covers it. The fill copy of the button label is `aria-hidden`, so the accessible name is unchanged.
- **Trade-off:** visitors who never interact now see the slideshow, which was the original reason for rejecting autoplay. The client chose this deliberately, with the countdown as a signal of what's coming.

## Dependencies

- Spec section 5; e2e tests in `tests/e2e/hero.spec.ts`.
