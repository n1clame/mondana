
import type { Traits } from '@/lib/pfp/types'

export async function getInitialTraits(): Promise<Traits> {
  async function safeJson(url: string) {
    try { const r = await fetch(url); if (!r.ok) throw 0; return await r.json() } catch { return null }
  }
  const disk = await safeJson('/traits.json')
  const index = await safeJson('/api/index')
  const order = disk?.order || index?.order || ['bg','glasses','headwear']
  const traits: any = { bg: [], glasses: [], headwear: [] }

  for (const k of order) {
    const byDisk = (disk?.traits?.[k] || []) as any[]
    const byIndex = (index?.traits?.[k] || []) as any[]
    const merged: any[] = []
    const seen = new Set<string>()
    ;[...byDisk, ...byIndex].forEach((t) => { if (!seen.has(t.id)) { seen.add(t.id); merged.push(t) } })
    traits[k] = merged
  }
  return { order, traits } as Traits
}
