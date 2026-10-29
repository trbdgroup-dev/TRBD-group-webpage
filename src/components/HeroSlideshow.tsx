'use client'

import { ArrowRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  type AnimationEvent,
  type CSSProperties,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import {
  heroReducer,
  initialHeroState,
  INTRO_MS,
  ROTATION_MS,
  shouldAutoAdvance,
  shouldRunIntro,
} from '@/lib/hero/reducer'
import type { ImageData } from '@/lib/media'

// Home hero (ADR-003): opens on the TRBD intro, whose Explore button fills over
// INTRO_MS before the vertical slideshow starts by itself (or at once on a click).
// In the slideshow the next tile fills over ROTATION_MS; the slide changes when
// that fill animation ends, so pausing (hover, focus, button) holds both together.
// Every slide is server-rendered; inactive ones are `hidden`. The header logo
// sends HERO_RESET_EVENT on the home page.

export const HERO_RESET_EVENT = 'trbd:hero-reset'

export type HeroSlide = {
  name: string
  headline: string
  summary: string
  href: string
  image: ImageData | null
}

type Props = {
  label: string
  title: string
  ctaLabel: string
  image: ImageData | null
  slides: HeroSlide[]
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const prefersReducedMotion = () => window.matchMedia(reducedMotionQuery).matches
function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(reducedMotionQuery)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}
const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false)

// True once hydrated: fill animations start only when React can hear them end.
const noop = () => () => {}
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

/** Ignores animationend bubbling up from children, and the instant end under reduced motion. */
function onOwnAnimationEnd(handler: () => void) {
  return (event: AnimationEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && !prefersReducedMotion()) handler()
  }
}

function Background({
  image,
  active,
  priority,
}: {
  image: ImageData | null
  active: boolean
  priority?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
    >
      {image ? (
        <Image
          src={image.src}
          alt=""
          fill
          // The intro photo is the LCP element: fetch it first (Next 16 replaces `priority`).
          {...(priority ? { loading: 'eager' as const, fetchPriority: 'high' as const } : {})}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: image.position }}
        />
      ) : (
        <div className="size-full bg-navy" />
      )}
    </div>
  )
}

export function HeroSlideshow({ label, title, ctaLabel, image, slides }: Props) {
  const [state, dispatch] = useReducer(heroReducer, initialHeroState)
  const [hovering, setHovering] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  // Vertical backgrounds load only once the visitor shows interest or the intro is
  // halfway to starting the slideshow (LCP stays the intro image).
  const [primed, setPrimed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const hydrated = useHydrated()
  const sectionRef = useRef<HTMLElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  const count = slides.length
  const inSlides = state.mode === 'slides'
  const nextIndex = count > 0 ? (state.index + 1) % count : 0

  const prime = useCallback(() => setPrimed(true), [])

  const autoAdvance = shouldAutoAdvance(state, {
    interacting: hovering || focusWithin,
    reducedMotion,
  })
  const introRunning = shouldRunIntro(state, { focused: focusWithin, reducedMotion })
  // The intro is counting down (running or paused) rather than waiting for a click.
  const introCountdown = state.mode === 'intro' && state.autoStart && !reducedMotion

  useEffect(() => {
    if (!introRunning) return
    const timer = window.setTimeout(prime, INTRO_MS / 2)
    return () => window.clearTimeout(timer)
  }, [introRunning, prime])

  useEffect(() => {
    const reset = () => {
      dispatch({ type: 'RESET' })
      setFocusWithin(false)
    }
    window.addEventListener(HERO_RESET_EVENT, reset)
    return () => window.removeEventListener(HERO_RESET_EVENT, reset)
  }, [])

  // On phones the tile row scrolls sideways: keep the current tile in view.
  useEffect(() => {
    const row = tilesRef.current
    if (!inSlides || !row || row.scrollWidth <= row.clientWidth) return
    const tile = row.children[state.index] as HTMLElement | undefined
    if (!tile) return
    const offset = tile.getBoundingClientRect().left - row.getBoundingClientRect().left
    row.scrollBy({ left: offset, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [inSlides, state.index])

  const explore = () => {
    prime()
    dispatch({ type: 'EXPLORE' })
  }

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="TRBD Consulting Group and our verticals"
      className="relative flex min-h-[clamp(620px,88vh,820px)] flex-col justify-between overflow-hidden text-white"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget as Node | null)) setFocusWithin(false)
      }}
    >
      <Background image={image} active={!inSlides} priority />
      {primed &&
        slides.map((slide, i) => (
          <Background key={slide.href} image={slide.image} active={inSlides && state.index === i} />
        ))}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,41,0.88)_0%,rgba(13,27,41,0.7)_50%,rgba(13,27,41,0.25)_100%)]"
      />

      <div
        className="wrap relative z-10 pt-16 sm:pt-24"
        aria-live={autoAdvance || introRunning ? 'off' : 'polite'}
      >
        <div hidden={inSlides} className="max-w-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">{label}</p>
          <h1 className="mt-4 text-[clamp(38px,6vw,72px)]">{title}</h1>
          {/* Faded (outlined) until its amber fill sweeps across; then the slideshow starts.
              The fill is a decorative copy of the label, so the button's name stays the same. */}
          <button
            type="button"
            onClick={explore}
            onPointerEnter={prime}
            className="group relative mt-9 inline-flex cursor-pointer items-center gap-3 overflow-hidden border-2 border-amber bg-navy/40 px-7 py-4 text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:brightness-105"
          >
            {ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-1"
            />
            <span
              aria-hidden="true"
              className={`absolute inset-0 flex items-center justify-center gap-3 bg-amber text-navy ${
                introCountdown && hydrated ? 'animate-reveal' : ''
              }`}
              style={
                introCountdown
                  ? hydrated
                    ? ({
                        '--fill-ms': `${INTRO_MS}ms`,
                        animationPlayState: introRunning ? 'running' : 'paused',
                      } as CSSProperties)
                    : { clipPath: 'inset(0 100% 0 0)' }
                  : undefined
              }
              onAnimationEnd={onOwnAnimationEnd(explore)}
            >
              {ctaLabel}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {slides.map((slide, i) => (
          <div
            key={slide.href}
            hidden={!inSlides || state.index !== i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slide.name}`}
            className="max-w-[760px]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">
              {slide.name}
            </p>
            <h2 className="mt-4 text-[clamp(38px,6vw,72px)]">{slide.headline}</h2>
            <p className="mt-5 max-w-[36em] text-lg text-white/80">{slide.summary}</p>
            <Link
              href={slide.href}
              className="group mt-8 inline-flex items-center gap-2.5 text-sm font-semibold text-white no-underline"
            >
              Learn more about {slide.name}
              <span
                aria-hidden="true"
                className="grid size-7 place-items-center rounded-full border-[1.5px] border-current transition-transform group-hover:translate-x-[3px]"
              >
                →
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="wrap relative z-10 pb-8" onPointerEnter={prime} onFocus={prime}>
        <div className="mb-4 flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid h-0.5 flex-1 bg-white/25"
            style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
          >
            {slides.map((slide, i) => (
              <span
                key={slide.href}
                className={`transition-colors ${inSlides && state.index === i ? 'bg-amber' : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            hidden={!inSlides && !introCountdown}
            onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
            aria-label={state.paused ? 'Play slideshow' : 'Pause slideshow'}
            className="grid size-8 cursor-pointer place-items-center rounded-full border border-white/45 text-white"
          >
            {state.paused ? (
              <Play aria-hidden="true" className="size-3.5" />
            ) : (
              <Pause aria-hidden="true" className="size-3.5" />
            )}
          </button>
        </div>

        <div
          ref={tilesRef}
          role="group"
          aria-label="Choose a vertical"
          className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 [scrollbar-width:none] sm:-mr-6 sm:pr-6 nav:mr-0 nav:grid nav:overflow-visible nav:pr-0"
          style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
        >
          {slides.map((slide, i) => {
            const current = inSlides && state.index === i
            // The following slide's tile fills in as its turn approaches.
            const filling = inSlides && i === nextIndex && count > 1 && !reducedMotion
            return (
              <button
                key={slide.href}
                type="button"
                aria-current={current}
                onClick={() => {
                  prime()
                  dispatch({ type: 'SELECT', index: i, count })
                }}
                className={`group relative flex h-[132px] w-[62%] shrink-0 cursor-pointer snap-start items-end overflow-hidden bg-navy text-left nav:w-auto ${current ? 'shadow-[inset_0_-3px_0_var(--color-amber)]' : ''}`}
              >
                {slide.image ? (
                  <Image
                    src={slide.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 20vw, 62vw"
                    // Tiles load after the intro photo (the LCP element) on slow connections.
                    fetchPriority="low"
                    className="object-cover"
                    style={{ objectPosition: slide.image.position }}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(0deg,rgba(13,27,41,0.8),transparent_70%)]"
                />
                {/* Fade over every tile but the current one; on the next tile it
                    clears from left to right, and the slide changes when it's gone. */}
                {current ? null : (
                  <span
                    // A new key restarts the fill for each slide.
                    key={filling ? `fill-${state.index}` : 'faded'}
                    aria-hidden="true"
                    data-tile-fade={filling ? 'filling' : 'faded'}
                    className={`absolute inset-0 bg-navy/60 backdrop-grayscale ${
                      filling ? 'animate-unfade' : 'transition-opacity group-hover:opacity-40'
                    }`}
                    style={
                      filling
                        ? ({
                            '--fill-ms': `${ROTATION_MS}ms`,
                            animationPlayState: autoAdvance ? 'running' : 'paused',
                          } as CSSProperties)
                        : undefined
                    }
                    onAnimationEnd={onOwnAnimationEnd(() => dispatch({ type: 'NEXT', count }))}
                  />
                )}
                <span className="relative px-4 py-3.5 font-semibold">{slide.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
