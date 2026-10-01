import { Trophy } from 'lucide-react'
import type { Player } from '@/lib/game-state'
import { TallySheet } from './tally-sheet'

export function FinalScreen({
  players,
  totalSeasons,
  onRestart,
}: {
  players: Player[]
  totalSeasons: number
  onRestart: () => void
}) {
  const ranked = [...players]
    .map((p) => ({ ...p, total: p.tally.reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total)
  const best = ranked[0]?.total ?? 0

  return (
    <main className="grass-bg min-h-dvh px-4 py-8 md:py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <section className="pixel-frame flex flex-col items-center gap-4 bg-card p-6 text-center">
          <span className="flex size-16 items-center justify-center border-4 border-foreground bg-accent">
            <Trophy className="size-8" aria-hidden="true" />
          </span>
          <h1 className="font-mono text-xl leading-snug text-balance">Harvest Festival!</h1>
          <p className="leading-relaxed">All {totalSeasons} seasons are in the barn. Here is how every farm did.</p>
          <ol className="flex w-full flex-col gap-2">
            {ranked.map((p, i) => (
              <li
                key={p.id}
                className={`flex items-center justify-between border-3 border-foreground px-4 py-3 ${
                  p.total === best ? 'bg-accent' : 'bg-muted'
                }`}
              >
                <span className="font-mono text-xs">
                  {i + 1}. {p.name}
                </span>
                <span className="font-mono text-sm tabular-nums">{p.total}</span>
              </li>
            ))}
          </ol>
          <button onClick={onRestart} className="pixel-btn bg-primary px-6 py-4 font-mono text-xs text-primary-foreground">
            Plant a New Game
          </button>
        </section>
        <TallySheet players={players} totalSeasons={totalSeasons} currentSeason={-1} />
      </div>
    </main>
  )
}
