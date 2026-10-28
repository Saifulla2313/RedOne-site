/** Считает слова в документе Lexical (richText). */
export const countWords = (node: unknown): number => {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  let total = 0
  if (typeof n.text === 'string') total += n.text.split(/\s+/).filter(Boolean).length
  if (n.root) total += countWords(n.root)
  if (Array.isArray(n.children)) for (const c of n.children) total += countWords(c)
  return total
}
