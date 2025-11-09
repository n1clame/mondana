
import type { TraitItem } from '@/lib/pfp/types'
export function pickRandomByRarity(arr: TraitItem[]): TraitItem | null {
  if (!arr || !arr.length) return null
  const total = arr.reduce((s, t) => s + (t.rarity ?? 0), 0)
  const r = Math.random() * (total || 1)
  let acc = 0
  for (const t of arr) { acc += (t.rarity ?? 0); if (r <= acc) return t }
  return arr[0]
}
