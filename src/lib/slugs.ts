// URL rules shared by Pages and Verticals (spec §4).

export const VERTICAL_SLUGS = [
  'manpower',
  'education-training',
  'oil-gas',
  'green-energy',
  'global-business',
] as const
export type VerticalSlug = (typeof VERTICAL_SLUGS)[number]

/** Addresses owned by the app, later stages or the five verticals. */
export const RESERVED_PAGE_SLUGS: readonly string[] = [
  'cms',
  'api',
  'account',
  'insights',
  'admin',
  'preview',
  '_next',
  'sitemap.xml',
  'robots.txt',
  ...VERTICAL_SLUGS,
]

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Payload validate function: returns true or a message for the editor. */
export function validatePageSlug(value: unknown): true | string {
  if (typeof value !== 'string' || value.length === 0) return 'Enter an address for this page.'
  if (!SLUG_PATTERN.test(value)) {
    return 'Use lowercase letters, numbers and single hyphens only, e.g. "about-us".'
  }
  if (RESERVED_PAGE_SLUGS.includes(value)) {
    return `"/${value}" is reserved by the site. Choose a different address.`
  }
  return true
}

/** "About Us & Team!" → "about-us-team" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Home is stored as the page with slug "home" and served at "/". */
export const pagePath = (slug: string): string => (slug === 'home' ? '/' : `/${slug}`)
