'use client'

import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Shovel } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARDS_PER_CROP, CROP_ORDER, CROPS, type CropId } from '@/lib/game'
import { CropSprite, Stars } from './crop-sprite'

export type Tool = CropId | 'shovel' | null

export function CropCardFace({ crop, className }: { crop: CropId; className?: string }) {
  const def = CROPS[crop]
  return (
    <div className={cn('flex flex-col bg-card text-card-foreground', className)}>
      <CropSprite crop={crop} className="aspect-[4/3] w-full border-b-3 border-foreground" />
      <div className="flex flex-col gap-1 p-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] leading-tight">{def.name}</span>
          <Stars count={def.baseYield} />
        </div>
        <span className="text-xs font-semibold uppercase leading-tight text-muted-foreground">
          {def.traits.join(' / ')}
          {def.flowering ? ' / Flowering' : ''}
        </span>
        <p className="text-sm leading-snug text-pretty">{def.effect}</p>
      </div>
    </div>
  )
}

function TrayCard({
  crop,
  remaining,
  selected,
  disabled,
  onSelect,
}: {
  crop: CropId
  remaining: number
  selected: boolean
  disabled: boolean
  onSelect: () => void
}) {
  const empty = remaining <= 0
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray:${crop}`,
    data: { source: 'tray', crop },
    disabled: disabled || empty,
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={onSelect}
      disabled={disabled || empty}
      aria-pressed={selected}
      aria-label={`${CROPS[crop].name}, ${remaining} cards left. Drag onto a plot or tap to select.`}
      className={cn(
        'pixel-frame-sm relative touch-none select-none text-left transition-transform',
        'cursor-grab active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50',
        selected && '-translate-y-1 outline-4 outline-offset-2 outline-accent',
        isDragging && 'opacity-40',
      )}
    >
      <CropCardFace crop={crop} />
      <span className="absolute right-1 top-1 bg-foreground px-1.5 py-0.5 font-mono text-[9px] text-card">
        x{remaining}
      </span>
    </button>
  )
}

export function CropTray({
  counts,
  tool,
  onToolChange,
  disabled,
}: {
  counts: Record<CropId, number>
  tool: Tool
  onToolChange: (tool: Tool) => void
  disabled: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'compost' })

  return (
    <section
      ref={setNodeRef}
      aria-labelledby="seed-bag-heading"
      className={cn('pixel-frame bg-muted p-3 transition-colors md:p-4', isOver && 'bg-accent')}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="seed-bag-heading" className="font-mono text-xs">
            Seed Bag
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Drag cards onto your plot, or tap a card then tap a plot. Drag a planted crop here to pull it up.
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          aria-pressed={tool === 'shovel'}
          onClick={() => onToolChange(tool === 'shovel' ? null : 'shovel')}
          className={cn(
            'pixel-btn flex items-center gap-2 bg-card px-3 py-2 font-mono text-[10px]',
            tool === 'shovel' && 'bg-accent',
          )}
        >
          <Shovel className="size-4" aria-hidden="true" />
          Shovel
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CROP_ORDER.map((crop) => (
          <li key={crop}>
            <TrayCard
              crop={crop}
              remaining={CARDS_PER_CROP - counts[crop]}
              selected={tool === crop}
              disabled={disabled}
              onSelect={() => onToolChange(tool === crop ? null : crop)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
