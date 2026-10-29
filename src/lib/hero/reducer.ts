// Home hero state (ADR-003). Pure so it can be unit-tested without a browser.
// `intro` shows TRBD; the Explore button fills over INTRO_MS and then the
// slideshow starts on its own (once per visit). `slides` shows one vertical at a time.

export type HeroState = {
  mode: 'intro' | 'slides'
  index: number
  paused: boolean
  /** The intro still starts the slideshow by itself. Off after the first start or a reset. */
  autoStart: boolean
}

export type HeroAction =
  | { type: 'EXPLORE' }
  | { type: 'SELECT'; index: number; count: number }
  | { type: 'NEXT'; count: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET' }

export const initialHeroState: HeroState = {
  mode: 'intro',
  index: 0,
  paused: false,
  autoStart: true,
}

/** How long the Explore button takes to fill before the slideshow starts. */
export const INTRO_MS = 6000
/** How long each slide shows; the next tile fills over this time. */
export const ROTATION_MS = 7000

export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case 'EXPLORE':
      return { mode: 'slides', index: 0, paused: false, autoStart: false }
    case 'SELECT': {
      if (action.count <= 0) return state
      const index = Math.min(Math.max(action.index, 0), action.count - 1)
      return { mode: 'slides', index, paused: false, autoStart: false }
    }
    case 'NEXT':
      if (state.mode !== 'slides' || action.count <= 0) return state
      return { ...state, index: (state.index + 1) % action.count }
    case 'TOGGLE_PAUSE':
      return state.mode === 'slides' || state.autoStart
        ? { ...state, paused: !state.paused }
        : state
    case 'RESET':
      // Back to the intro, which then waits for the visitor (no second automatic start).
      return { ...initialHeroState, autoStart: false }
    default:
      return state
  }
}

type Conditions = { interacting: boolean; reducedMotion: boolean }

/** Rotation runs only in the slideshow, unpaused, not hovered or focused, and never with reduced motion. */
export function shouldAutoAdvance(
  state: HeroState,
  { interacting, reducedMotion }: Conditions,
): boolean {
  return state.mode === 'slides' && !state.paused && !interacting && !reducedMotion
}

/**
 * The intro's Explore button is filling towards the automatic start. Hovering
 * doesn't hold it (the pointer often rests on the large hero); keyboard focus
 * inside the hero, the pause button and reduced motion do.
 */
export function shouldRunIntro(
  state: HeroState,
  { focused, reducedMotion }: { focused: boolean; reducedMotion: boolean },
): boolean {
  return state.mode === 'intro' && state.autoStart && !state.paused && !focused && !reducedMotion
}
