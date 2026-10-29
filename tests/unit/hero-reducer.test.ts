import { describe, expect, it } from 'vitest'

import {
  heroReducer,
  initialHeroState,
  shouldAutoAdvance,
  shouldRunIntro,
  type HeroState,
} from '@/lib/hero/reducer'

const slides = (index: number, paused = false): HeroState => ({
  mode: 'slides',
  index,
  paused,
  autoStart: false,
})
const intro = { ...initialHeroState, autoStart: false }

describe('heroReducer', () => {
  it('starts on the TRBD intro, set to start the slideshow by itself, without rotating', () => {
    expect(initialHeroState).toEqual({ mode: 'intro', index: 0, paused: false, autoStart: true })
    expect(shouldAutoAdvance(initialHeroState, { interacting: false, reducedMotion: false })).toBe(
      false,
    )
  })

  it('Explore (clicked or automatic) opens the first vertical (Manpower) and starts rotating', () => {
    expect(heroReducer(initialHeroState, { type: 'EXPLORE' })).toEqual(slides(0))
  })

  it('selecting a tile opens that vertical, clamped to the range, and unpauses', () => {
    expect(heroReducer(initialHeroState, { type: 'SELECT', index: 3, count: 5 })).toEqual(slides(3))
    expect(heroReducer(slides(1, true), { type: 'SELECT', index: 9, count: 5 })).toEqual(slides(4))
    expect(heroReducer(slides(1), { type: 'SELECT', index: -2, count: 5 })).toEqual(slides(0))
    expect(heroReducer(initialHeroState, { type: 'SELECT', index: 0, count: 0 })).toBe(
      initialHeroState,
    )
  })

  it('NEXT advances and wraps in the slideshow, and does nothing on the intro', () => {
    expect(heroReducer(slides(2), { type: 'NEXT', count: 5 })).toEqual(slides(3))
    expect(heroReducer(slides(4), { type: 'NEXT', count: 5 })).toEqual(slides(0))
    expect(heroReducer(initialHeroState, { type: 'NEXT', count: 5 })).toBe(initialHeroState)
  })

  it('pause toggles in the slideshow and during the intro countdown', () => {
    expect(heroReducer(slides(1), { type: 'TOGGLE_PAUSE' })).toEqual(slides(1, true))
    expect(heroReducer(slides(1, true), { type: 'TOGGLE_PAUSE' })).toEqual(slides(1))
    expect(heroReducer(initialHeroState, { type: 'TOGGLE_PAUSE' })).toEqual({
      ...initialHeroState,
      paused: true,
    })
    // After a reset the intro just waits, so there is nothing to pause.
    expect(heroReducer(intro, { type: 'TOGGLE_PAUSE' })).toBe(intro)
  })

  it('RESET (logo click) returns to the intro, which then waits for the visitor', () => {
    expect(heroReducer(slides(3, true), { type: 'RESET' })).toEqual(intro)
    expect(heroReducer({ ...initialHeroState, paused: true }, { type: 'RESET' })).toEqual(intro)
  })
})

describe('shouldAutoAdvance', () => {
  const quiet = { interacting: false, reducedMotion: false }

  it('rotates only in an unpaused slideshow', () => {
    expect(shouldAutoAdvance(slides(0), quiet)).toBe(true)
    expect(shouldAutoAdvance(slides(0, true), quiet)).toBe(false)
  })

  it('holds while the visitor hovers or focuses inside the hero', () => {
    expect(shouldAutoAdvance(slides(0), { ...quiet, interacting: true })).toBe(false)
  })

  it('never auto-advances with reduced motion', () => {
    expect(shouldAutoAdvance(slides(0), { ...quiet, reducedMotion: true })).toBe(false)
  })
})

describe('shouldRunIntro', () => {
  const quiet = { focused: false, reducedMotion: false }

  it('counts down on first load only', () => {
    expect(shouldRunIntro(initialHeroState, quiet)).toBe(true)
    expect(shouldRunIntro(intro, quiet)).toBe(false)
    expect(shouldRunIntro(slides(0), quiet)).toBe(false)
  })

  it('holds while paused or while focus is inside the hero', () => {
    expect(shouldRunIntro({ ...initialHeroState, paused: true }, quiet)).toBe(false)
    expect(shouldRunIntro(initialHeroState, { ...quiet, focused: true })).toBe(false)
  })

  it('never starts the slideshow by itself with reduced motion', () => {
    expect(shouldRunIntro(initialHeroState, { ...quiet, reducedMotion: true })).toBe(false)
  })
})
