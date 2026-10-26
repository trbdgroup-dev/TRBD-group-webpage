// Home hero state (ADR-003). Pure so it can be unit-tested without a browser.
// `intro` shows TRBD with no rotation; `slides` shows one vertical at a time.

export type HeroState = {
  mode: 'intro' | 'slides'
  index: number
  paused: boolean
}

export type HeroAction =
  | { type: 'EXPLORE' }
  | { type: 'SELECT'; index: number; count: number }
  | { type: 'NEXT'; count: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET' }

export const initialHeroState: HeroState = { mode: 'intro', index: 0, paused: false }

export const ROTATION_MS = 7000

export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case 'EXPLORE':
      return { mode: 'slides', index: 0, paused: false }
    case 'SELECT': {
      if (action.count <= 0) return state
      const index = Math.min(Math.max(action.index, 0), action.count - 1)
      return { mode: 'slides', index, paused: false }
    }
    case 'NEXT':
      if (state.mode !== 'slides' || action.count <= 0) return state
      return { ...state, index: (state.index + 1) % action.count }
    case 'TOGGLE_PAUSE':
      return state.mode === 'slides' ? { ...state, paused: !state.paused } : state
    case 'RESET':
      return initialHeroState
    default:
      return state
  }
}

/** Rotation runs only in the slideshow, unpaused, not hovered or focused, and never with reduced motion. */
export function shouldAutoAdvance(
  state: HeroState,
  { interacting, reducedMotion }: { interacting: boolean; reducedMotion: boolean },
): boolean {
  return state.mode === 'slides' && !state.paused && !interacting && !reducedMotion
}
