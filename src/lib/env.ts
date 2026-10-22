import { parseEnv } from './parse-env'

// Server-side environment. Read env only through this module so a missing
// variable fails at startup with a clear message instead of deep in a request.
export const env = parseEnv(process.env)
export type { Env } from './parse-env'
