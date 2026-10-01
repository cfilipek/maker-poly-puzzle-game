'use client'

import { useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { CROPS, GRID_COLS, type CellScore, type Grid } from '@/lib/game'
import { CropSprite } from './crop-sprite'

function PlotCell({
  index,
  cell,
  score,
  locked,
  highlighted,
  season,
  onActivate,
}: {
  index: number
  cell: Grid[number]
  score: CellScore | null
  locked: boolean
  highlighted: boolean
  season: number
  onActivate: (index: number) => void
}) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `plot:${index}`, disabled: locked })
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `cell:${index}`,
    data: { source: 'cell', index },
    disabled: locked || !cell,
  })

  const row = Math.floor(index / GRID_COLS) + 1
  const col = (index % GRID_COLS) + 1
  const label = cell
    ? `Plot row ${row} column ${col}: ${CROPS[cell.crop].name}${score ? `, ${score.total} points` : ''}`
    : `Empty plot row ${row} column ${col}`

  const penalized = score?.lines.some((l) => l.delta < 0)
  const freshLettuce = cell?.crop === 'lettuce' && cell.plantedSeason === season

  return (
    <div ref={setDropRef} className="relative aspect-square">
      <button
        ref={setDragRef}
        type="button"
        {...listeners}
        {...attributes}
        aria-disabled={locked}
        onClick={() => onActivate(index)}
        aria-label={label}
        className={cn(
          'soil-tile absolute inset-0 flex touch-none select-none items-center justify-center border-3 border-foreground p-1.5',
          'transition-[outline] focus-visible:outline-4 focus-visible:outline-accent',
          isOver && 'outline-4 -outline-offset-4 outline-accent',
          highlighted && 'outline-4 -outline-offset-4 outline-card',
          cell && !locked && 'cursor-grab active:cursor-grabbing',
        )}
      >
        {cell ? (
          <div
            key={`${cell.crop}-${cell.plantedSeason}`}
            className={cn(
              'animate-pop-in flex size-full flex-col border-3 border-foreground bg-card',
              isDragging && 'opacity-30',
            )}
          >
            <CropSprite crop={cell.crop} className="min-h-0 w-full flex-1" sizes="(min-width: 768px) 120px, 22vw" />
            <span className="truncate border-t-3 border-foreground bg-card px-1 py-0.5 text-center font-mono text-[7px] leading-tight sm:text-[9px]">
              {CROPS[cell.crop].name}
            </span>
          </div>
        ) : (
          <span aria-hidden="true" className="font-mono text-[10px] text-soil-foreground/40">
            +
          </span>
        )}
      </button>

      {score && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -right-1 -top-1 z-10 border-2 border-foreground px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px]',
            penalized ? 'bg-destructive text-card' : 'bg-accent text-accent-foreground',
          )}
        >
          {score.total}
        </span>
      )}
      {freshLettuce && !locked && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1 -top-1 z-10 border-2 border-foreground bg-card px-1 font-mono text-[7px]"
        >
          NEW
        </span>
      )}
    </div>
  )
}

export function PlotGrid({
  grid,
  scores,
  locked,
  season,
  highlightedIndex,
  onActivate,
}: {
  grid: Grid
  scores: (CellScore | null)[]
  locked: boolean
  season: number
  highlightedIndex: number | null
  onActivate: (index: number) => void
}) {
  return (
    <div className="pixel-frame bg-soil p-2 sm:p-3">
      <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}>
        {grid.map((cell, i) => (
          <PlotCell
            key={i}
            index={i}
            cell={cell}
            score={scores[i]}
            locked={locked}
            season={season}
            highlighted={highlightedIndex === i}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  )
}
