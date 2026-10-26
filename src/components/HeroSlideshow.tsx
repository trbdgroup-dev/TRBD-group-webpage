'use client'

import { ArrowRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react'

import { heroReducer, initialHeroState, ROTATION_MS, shouldAutoAdvance } from '@/lib/hero/reducer'
import type { ImageData } from '@/lib/media'

// Home hero (ADR-003): opens on the TRBD intro; the vertical slideshow starts only
// when the visitor clicks "Explore" or a tile. Every slide is server-rendered;
// inactive ones are `hidden`. The header logo sends HERO_RESET_EVENT on the home page.

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
function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(reducedMotionQuery)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}
const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  )

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
  // Vertical backgrounds load only once the visitor shows interest (LCP stays the intro image).
  const [primed, setPrimed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const count = slides.length
  const inSlides = state.mode === 'slides'

  const prime = useCallback(() => setPrimed(true), [])

  const autoAdvance = shouldAutoAdvance(state, {
    interacting: hovering || focusWithin,
    reducedMotion,
  })

  useEffect(() => {
    if (!autoAdvance) return
    const timer = window.setTimeout(() => dispatch({ type: 'NEXT', count }), ROTATION_MS)
    return () => window.clearTimeout(timer)
  }, [autoAdvance, state.index, count])

  useEffect(() => {
    const reset = () => {
      dispatch({ type: 'RESET' })
      setFocusWithin(false)
    }
    window.addEventListener(HERO_RESET_EVENT, reset)
    return () => window.removeEventListener(HERO_RESET_EVENT, reset)
  }, [])

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

      <div className="wrap relative z-10 pt-16 sm:pt-24" aria-live={autoAdvance ? 'off' : 'polite'}>
        <div hidden={inSlides} className="max-w-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">{label}</p>
          <h1 className="mt-4 text-[clamp(38px,6vw,72px)]">{title}</h1>
          <button
            type="button"
            onClick={explore}
            onPointerEnter={prime}
            className="group mt-9 inline-flex cursor-pointer items-center gap-3 bg-amber px-7 py-4 text-[17px] font-semibold text-navy shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:brightness-105"
          >
            {ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-1"
            />
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
            hidden={!inSlides}
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
          role="group"
          aria-label="Choose a vertical"
          className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 [scrollbar-width:none] sm:-mr-6 sm:pr-6 nav:mr-0 nav:grid nav:overflow-visible nav:pr-0"
          style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
        >
          {slides.map((slide, i) => {
            const current = inSlides && state.index === i
            return (
              <button
                key={slide.href}
                type="button"
                aria-current={current}
                onClick={() => {
                  prime()
                  dispatch({ type: 'SELECT', index: i, count })
                }}
                className={`relative flex h-[132px] w-[62%] shrink-0 cursor-pointer snap-start items-end overflow-hidden bg-navy text-left nav:w-auto ${current ? 'shadow-[inset_0_-3px_0_var(--color-amber)]' : ''}`}
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
                <span className="relative px-4 py-3.5 font-semibold">{slide.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
