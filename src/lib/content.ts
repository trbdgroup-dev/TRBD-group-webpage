// Small content helpers shared by page templates.

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }
type LexicalState = { root?: LexicalNode } | null | undefined

/** True when a rich text value has any visible text (an empty editor still holds an empty paragraph). */
export function hasRichText(value: LexicalState): boolean {
  const visit = (node: LexicalNode | undefined): boolean => {
    if (!node) return false
    if (typeof node.text === 'string' && node.text.trim() !== '') return true
    if (node.type === 'upload' || node.type === 'horizontalrule') return true
    return (node.children ?? []).some(visit)
  }
  return visit(value?.root)
}

/** mailto: link with an optional pre-filled subject, safely encoded. */
export function mailtoHref(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`
}
