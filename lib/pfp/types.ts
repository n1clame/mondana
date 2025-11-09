
export type LayerKey = 'bg' | 'glasses' | 'headwear'
export type Offset = { dx: number; dy: number }
export type Pivot = { x: number; y: number }
export type TraitItem = {
  id: string
  name: string
  file: string       // relative to /public/layers
  rarity: number
  attachTo?: string  // EYE_LINE | HEAD_TOP | MOUTH | ...
  pivot?: Pivot
  offset?: Offset
  transform?: { scale?: number; rotation?: number }
}
export type Traits = { order: LayerKey[]; traits: Record<LayerKey, TraitItem[]> }
export type Selection = Partial<Record<LayerKey, TraitItem | null>>
export type AnchorMap = { base: Record<string, { x: number; y: number }> }
export type ComposeImages = Partial<Record<LayerKey | 'base', HTMLImageElement>>

export type UiTransform = { dx?: number; dy?: number; scale?: number; rotation?: number }
export type UiTransforms = Partial<Record<LayerKey, UiTransform>>

export type ComposeOpts = {
  size: number
  traits: Traits
  selection: Selection
  anchors: AnchorMap
  transparentBg: boolean
  ui: UiTransforms
}
