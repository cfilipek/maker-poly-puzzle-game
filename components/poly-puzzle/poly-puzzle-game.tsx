'use client'

import { useMemo, useReducer, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Eraser, Lock, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countCrops, EVENTS, scoreGrid, type CropId } from '@/lib/game'
import { gameReducer, initialState, TOTAL_SEASONS } from '@/lib/game-state'
import { CropTray, type Tool } from './crop-tray'
import { CropSprite } from './crop-sprite'
import { EventCard } from './event-card'
import { FinalScreen } from './final-screen'
import { HarvestReport } from './harvest-report'
import { PlotGrid } from './plot-grid'
import { RulesPanel } from './rules-panel'
import { SeasonTimer } from './season-timer'
import { SetupScreen } from './setup-screen'
import { TallySheet } from './tally-sheet'

type DragData = { source: 'tray'; crop: CropId } | { source: 'cell'; index: number }

export function PolyPuzzleGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [tool, setTool] = useState<Tool>(null)
  const [inspected, setInspected] = useState<number | null>(null)
  const [draggingCrop, setDraggingCrop] = useState<CropId | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const { phase, season, players, activePlayer } = state
  const player = players[activePlayer]
  const planting = phase === 'plant'
  const revealedEvent = phase === 'reveal' ? state.events[season] : null

  const scored = useMemo(
    () => (player ? scoreGrid(player.grid, season, revealedEvent) : null),
    [player, season, revealedEvent],
  )
  const counts = useMemo(() => (player ? countCrops(player.grid) : null), [player])

  if (phase === 'setup') {
    return <SetupScreen totalSeasons={TOTAL_SEASONS} onStart={(names) => dispatch({ type: 'start', names })} />
  }
  if (phase === 'final') {
    return (
      <FinalScreen
        players={players}
        totalSeasons={TOTAL_SEASONS}
        onRestart={() => {
          setTool(null)
          setInspected(null)
          dispatch({ type: 'restart' })
        }}
      />
    )
  }
  if (!player || !scored || !counts) return null

  const handleDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current as DragData | undefined
    if (!data) return
    setDraggingCrop(data.source === 'tray' ? data.crop : (player.grid[data.index]?.crop ?? null))
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingCrop(null)
    const data = e.active.data.current as DragData | undefined
    const overId = e.over?.id ? String(e.over.id) : null
    if (!data || !overId) return
    if (overId.startsWith('plot:')) {
      const target = Number(overId.slice(5))
      if (data.source === 'tray') dispatch({ type: 'plant', index: target, crop: data.crop })
      else dispatch({ type: 'move', from: data.index, to: target })
      setInspected(target)
    } else if (overId === 'compost' && data.source === 'cell') {
      dispatch({ type: 'remove', index: data.index })
      setInspected(null)
    }
  }

  const handleCellActivate = (index: number) => {
    if (planting && tool === 'shovel') {
      dispatch({ type: 'remove', index })
      setInspected(null)
      return
    }
    if (planting && tool && tool !== 'shovel') {
      dispatch({ type: 'plant', index, crop: tool })
      setInspected(index)
      return
    }
    setInspected(player.grid[index] ? index : null)
  }

  const switchPlayer = (i: number) => {
    setInspected(null)
    setTool(null)
    dispatch({ type: 'selectPlayer', player: i })
  }

  const inspectedScore = inspected !== null ? scored.cells[inspected] : null
  const eventDef = revealedEvent ? EVENTS[revealedEvent] : null
  const lastSeason = season + 1 >= TOTAL_SEASONS

  return (
    <DndContext
      id="poly-puzzle-dnd"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDraggingCrop(null)}
    >
      <main className="grass-bg min-h-dvh px-3 pb-10 pt-4 md:px-6">
        <header className="pixel-frame mx-auto mb-5 flex max-w-6xl flex-wrap items-center justify-between gap-3 bg-card px-4 py-3">
          <div className="flex flex-col">
            <h1 className="font-mono text-sm md:text-base">Poly-Puzzle</h1>
            <p className="text-sm text-muted-foreground">
              Season {season + 1} of {TOTAL_SEASONS} &middot; {planting ? 'Planting' : 'Harvest'}
            </p>
          </div>
          {planting && <SeasonTimer key={season} />}
        </header>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-5">
            {players.length > 1 && (
              <nav aria-label="Farmers" className="flex flex-wrap gap-2">
                {players.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-current={i === activePlayer ? 'true' : undefined}
                    onClick={() => switchPlayer(i)}
                    className={cn(
                      'pixel-btn bg-card px-3 py-2 text-sm font-semibold',
                      i === activePlayer && 'bg-accent',
                    )}
                  >
                    {p.name}
                    {phase === 'reveal' && <span className="ml-2 font-mono text-[10px]">{p.tally[season]}</span>}
                  </button>
                ))}
              </nav>
            )}

            <section aria-labelledby="plot-heading" className="flex flex-col gap-3">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 id="plot-heading" className="font-mono text-xs text-foreground">
                  {player.name}&apos;s Poly-Plot
                </h2>
                {planting && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'clear' })
                      setInspected(null)
                    }}
                    className="pixel-btn flex items-center gap-2 bg-card px-3 py-1.5 text-sm"
                  >
                    <Eraser className="size-4" aria-hidden="true" />
                    Clear plot
                  </button>
                )}
              </div>
              <div className="mx-auto w-full max-w-md">
                <PlotGrid
                  grid={player.grid}
                  scores={scored.cells}
                  locked={!planting}
                  season={season}
                  highlightedIndex={inspected}
                  onActivate={handleCellActivate}
                />
              </div>
            </section>

            {planting && <CropTray counts={counts} tool={tool} onToolChange={setTool} disabled={!planting} />}
          </div>

          <aside className="flex flex-col gap-5">
            <EventCard season={season} event={eventDef} />

            {planting ? (
              <button
                type="button"
                onClick={() => {
                  setTool(null)
                  setInspected(null)
                  dispatch({ type: 'reveal' })
                }}
                className="pixel-btn flex items-center justify-center gap-2 bg-primary px-4 py-4 font-mono text-[11px] text-primary-foreground"
              >
                <Lock className="size-4" aria-hidden="true" />
                Lock plots &amp; reveal
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setInspected(null)
                  dispatch({ type: 'nextSeason' })
                }}
                className="pixel-btn flex items-center justify-center gap-2 bg-accent px-4 py-4 font-mono text-[11px]"
              >
                <SkipForward className="size-4" aria-hidden="true" />
                {lastSeason ? 'Final harvest' : `Start season ${season + 2}`}
              </button>
            )}

            <HarvestReport
              title={planting ? 'Projected yield' : 'Season yield'}
              total={scored.total}
              selected={inspectedScore}
              hint={
                planting
                  ? 'Projected before the event. Tap any planted crop to see how its score adds up.'
                  : 'Tap any crop on the plot to see its combos and event penalties.'
              }
            />

            <TallySheet players={players} totalSeasons={TOTAL_SEASONS} currentSeason={season} />
            <RulesPanel />
          </aside>
        </div>
      </main>

      <DragOverlay dropAnimation={null}>
        {draggingCrop ? (
          <div className="pixel-frame-sm size-20 rotate-3 bg-card">
            <CropSprite crop={draggingCrop} className="size-full" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
