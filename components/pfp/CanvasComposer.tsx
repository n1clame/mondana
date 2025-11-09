
"use client";
import { useEffect, useRef, useState } from 'react'
import type { AnchorMap, LayerKey, Selection, Traits, UiTransforms } from '@/lib/pfp/types'
import { composeToCanvas } from '@/lib/pfp/compose'

const SIZE = 1024
const imgCache = new Map<string, HTMLImageElement>()
const loadImage = (src: string) =>
  imgCache.has(src)
    ? Promise.resolve(imgCache.get(src)!)
    : new Promise<HTMLImageElement>((res, rej) => {
        const im = new Image()
        im.onload = () => { imgCache.set(src, im); res(im) }
        im.onerror = rej
        im.src = src
      })

export function CanvasComposer({ traits, selection, active, transparentBg }:{
  traits: Traits | null
  selection: Selection
  active: LayerKey | null
  transparentBg: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [anchors, setAnchors] = useState<AnchorMap | null>(null)
  const [ui, setUi] = useState<UiTransforms>({})
  const [anchorEdit, setAnchorEdit] = useState(false)

  useEffect(() => {
    fetch('/anchors.json').then(r => r.json()).then(setAnchors).catch(() => {
      setAnchors({ base: { HEAD_TOP:{x:0.54,y:0.27}, EYE_LINE:{x:0.44,y:0.40}, MOUTH:{x:0.43,y:0.51} } })
    })
  }, [])

  useEffect(() => {
    let raf = 0
    const draw = async () => {
      if (!ref.current || !traits || !anchors) return
      const ctx = ref.current.getContext('2d')!
      const images: any = {}
      const tasks: Promise<any>[] = []
      tasks.push(loadImage('/layers/base/base.png').then(im => images.base = im))
      ;(['bg','glasses','headwear'] as LayerKey[]).forEach(k => {
        const it = selection[k]; if (it) tasks.push(loadImage('/layers/' + it.file).then(im => images[k] = im))
      })
      await Promise.allSettled(tasks)
      composeToCanvas(ctx, images, { size: SIZE, traits: traits!, selection, anchors, transparentBg, ui })
    }
    const loop = () => { raf = requestAnimationFrame(draw) }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [traits, selection, anchors, transparentBg, ui])

  // pointer drag for active layer (updates ui.dx/ui.dy)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    let dragging = false, startX = 0, startY = 0, initDx = 0, initDy = 0

    const onDown = (e: PointerEvent) => {
      if (!active) return
      dragging = true
      const r = canvas.getBoundingClientRect()
      startX = e.clientX - r.left
      startY = e.clientY - r.top
      initDx = (ui[active]?.dx ?? 0)
      initDy = (ui[active]?.dy ?? 0)
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging || !active) return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      const ddx = (x - startX) / SIZE, ddy = (y - startY) / SIZE
      setUi(prev => ({ ...prev, [active]: { ...(prev[active]||{}), dx: clamp(initDx + ddx, -0.5, 0.5), dy: clamp(initDy + ddy, -0.5, 0.5) } }))
    }
    const onUp = (e: PointerEvent) => { dragging = false; try { canvas.releasePointerCapture(e.pointerId) } catch {} }

    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [ref.current, active, ui])

  const saveAnchors = async () => {
    if (!anchors) return
    await fetch('/api/anchors', { method: 'POST', body: JSON.stringify(anchors, null, 2) })
    alert('anchors.json saved')
  }

  return (
    <div className="grid gap-4">
      <div className="relative mx-auto w-full max-w-[1024px]">
        <canvas ref={ref} width={SIZE} height={SIZE} className="mx-auto block rounded-xl bg-black/20" />
        {anchorEdit && anchors && (
          <svg className="pointer-events-none absolute inset-0" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {Object.entries(anchors.base).map(([k,p]) => (
              <g key={k}>
                <circle cx={p.x*SIZE} cy={p.y*SIZE} r={10} fill="#7c5cff" opacity={0.9} />
                <text x={p.x*SIZE+12} y={p.y*SIZE+4} fill="#fff" fontSize={14}>{k}</text>
              </g>
            ))}
          </svg>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="btn" onClick={() => setAnchorEdit(v => !v)}>{anchorEdit ? 'Anchor Edit: ON' : 'Anchor Edit: OFF'}</button>
        {anchorEdit && <button className="btn" onClick={saveAnchors}>Save anchors.json</button>}
      </div>
    </div>
  )
}

function clamp(n:number,a:number,b:number){ return Math.max(a, Math.min(b, n)) }
