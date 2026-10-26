import type { Field } from 'payload'

// A link the content writer can point at a page, a vertical, a section of the
// home page or another website. Resolved to an href by lib/links (task C1).
export const linkField = ({
  name = 'link',
  withLabel = true,
}: { name?: string; withLabel?: boolean } = {}): Field => ({
  name,
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    ...(withLabel ? [{ name: 'label', type: 'text', required: true } as Field] : []),
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'Vertical', value: 'vertical' },
            { label: 'Home page section', value: 'anchor' },
            { label: 'Other website', value: 'external' },
          ],
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in a new tab',
          admin: { condition: (_, sibling) => sibling?.type === 'external' },
        },
      ],
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      required: true,
      admin: { condition: (_, sibling) => sibling?.type === 'page' },
    },
    {
      name: 'vertical',
      type: 'relationship',
      relationTo: 'verticals',
      required: true,
      admin: { condition: (_, sibling) => sibling?.type === 'vertical' },
    },
    {
      name: 'anchor',
      type: 'select',
      required: true,
      options: [
        { label: 'Who we are', value: 'about' },
        { label: 'What we do', value: 'verticals' },
        { label: 'How we work', value: 'approach' },
        { label: 'Why TRBD', value: 'why' },
        { label: 'Contact', value: 'contact' },
      ],
      admin: { condition: (_, sibling) => sibling?.type === 'anchor' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      required: true,
      validate: (value: unknown, { siblingData }: { siblingData: { type?: string } }) => {
        if (siblingData?.type !== 'external') return true
        return typeof value === 'string' && /^(https?:|mailto:|tel:)/.test(value)
          ? true
          : 'Enter a full address starting with https://, mailto: or tel:'
      },
      admin: { condition: (_, sibling) => sibling?.type === 'external' },
    },
  ],
})
