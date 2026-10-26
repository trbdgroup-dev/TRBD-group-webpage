import type { Field, SelectField } from 'payload'

// Fields several blocks share.

/** Optional id so header and footer links can jump to the section, e.g. /#approach. */
export const anchorField = (): SelectField => ({
  name: 'anchor',
  type: 'select',
  options: [
    { label: 'Who we are', value: 'about' },
    { label: 'What we do', value: 'verticals' },
    { label: 'How we work', value: 'approach' },
    { label: 'Why TRBD', value: 'why' },
    { label: 'Contact', value: 'contact' },
  ],
  admin: { description: 'Lets menu links jump to this section.' },
})

/** Label, heading and intro shown above most sections. */
export const sectionHeaderFields = (): Field[] => [
  anchorField(),
  { name: 'label', type: 'text', required: true },
  { name: 'heading', type: 'text', required: true },
  { name: 'intro', type: 'textarea' },
]
