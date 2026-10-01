import { cn } from '@/lib/utils'
import type { Player } from '@/lib/game-state'

export function TallySheet({
  players,
  totalSeasons,
  currentSeason,
}: {
  players: Player[]
  totalSeasons: number
  currentSeason: number
}) {
  return (
    <section aria-labelledby="tally-heading" className="pixel-frame bg-card p-3">
      <h2 id="tally-heading" className="mb-2 font-mono text-xs">
        Tally Sheet
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className="border-2 border-foreground bg-muted px-2 py-1 text-left">
                Season
              </th>
              {players.map((p) => (
                <th key={p.id} scope="col" className="max-w-24 truncate border-2 border-foreground bg-muted px-2 py-1">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: totalSeasons }, (_, s) => (
              <tr key={s} className={cn(s === currentSeason && 'bg-accent/40')}>
                <th scope="row" className="border-2 border-foreground px-2 py-1 text-left font-semibold">
                  {s + 1}
                </th>
                {players.map((p) => (
                  <td key={p.id} className="border-2 border-foreground px-2 py-1 text-center tabular-nums">
                    {p.tally[s] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-primary text-primary-foreground">
              <th scope="row" className="border-2 border-foreground px-2 py-1 text-left">
                Final
              </th>
              {players.map((p) => (
                <td key={p.id} className="border-2 border-foreground px-2 py-1 text-center font-mono text-[10px]">
                  {p.tally.reduce((a, b) => a + b, 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
