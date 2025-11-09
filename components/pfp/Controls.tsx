
"use client";
import JSZip from 'jszip'
import type { LayerKey, Selection, Traits } from '@/lib/pfp/types'
import { pickRandomByRarity } from '@/lib/pfp/random'

export function Controls({ traits, selection, setSelection, active, setActive, transparentBg, setTransparentBg, disabled } : {
  traits: Traits | null
  selection: Selection
  setSelection: (s: Selection) => void
  active: LayerKey | null
  setActive: (k: LayerKey | null) => void
  transparentBg: boolean
  setTransparentBg: (v: boolean) => void
  disabled?: boolean
}) {
  const onPick = (key: LayerKey, id: string) => {
    if (!traits) return
    const item = traits.traits[key].find((t) => t.id === id) || null
    setSelection({ ...selection, [key]: item })
  }

  const randomize = () => {
    if (!traits) return
    const next: Selection = {}
    ;(['bg','glasses','headwear'] as LayerKey[]).forEach((k) => {
      const arr = traits.traits[k]
      next[k] = pickRandomByRarity(arr)
    })
    setSelection(next)
  }

  const clearAll = () => setSelection({})

  const downloadPNG = async () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    if (!canvas) return
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
    if (!blob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    const nbg = selection.bg?.id || 'none'
    const ng = selection.glasses?.id || 'none'
    const nh = selection.headwear?.id || 'none'
    a.download = `shrimp-${nbg}_${ng}_${nh}.png`
    a.click()
  }

  const batchZip = async () => {
    if (!traits) return
    const old = { ...selection }
    const zip = new JSZip()
    for (let i=0; i<10; i++) {
      const s: Selection = {}
      ;(['bg','glasses','headwear'] as LayerKey[]).forEach((k) => (s[k] = pickRandomByRarity(traits.traits[k])))
      setSelection(s)
      await new Promise((r) => setTimeout(r, 50))
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
      if (blob) zip.file(`pfp-${i+1}.png`, blob)
    }
    setSelection(old)
    const out = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(out)
    a.download = 'pfp-batch.zip'
    a.click()
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm text-white/70">Background</label>
          <select className="neon-surface w-full rounded-xl bg-black/30 px-3 py-2" value={selection.bg?.id || ''} onChange={(e)=>onPick('bg', e.target.value)}>
            <option value="">None</option>
            {traits?.traits.bg.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70">Glasses</label>
          <select className="neon-surface w-full rounded-xl bg-black/30 px-3 py-2" value={selection.glasses?.id || ''} onChange={(e)=>onPick('glasses', e.target.value)}>
            <option value="">None</option>
            {traits?.traits.glasses.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70">Headwear</label>
          <select className="neon-surface w-full rounded-xl bg-black/30 px-3 py-2" value={selection.headwear?.id || ''} onChange={(e)=>onPick('headwear', e.target.value)}>
            <option value="">None</option>
            {traits?.traits.headwear.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn" onClick={randomize} disabled={disabled}>Randomize</button>
        <button className="btn" onClick={clearAll}>Clear</button>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={transparentBg} onChange={(e)=>setTransparentBg(e.target.checked)} />
          <span className="text-sm text-white/70">Transparent background</span>
        </label>
        <button className="btn" onClick={downloadPNG}>Download PNG</button>
        <button className="btn" onClick={batchZip} disabled={disabled}>Batch x10 (zip)</button>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm text-white/70">Active Layer</legend>
        <div className="flex gap-2">
          {(['bg','glasses','headwear'] as LayerKey[]).map(k => (
            <button key={k} className={`btn ${active===k ? 'ring-2 ring-white/60' : ''}`} onClick={()=>setActive(k)}>{k}</button>
          ))}
          <button className={`btn ${active===null ? 'ring-2 ring-white/60' : ''}`} onClick={()=>setActive(null)}>none</button>
        </div>
      </fieldset>
    </div>
  )
}
