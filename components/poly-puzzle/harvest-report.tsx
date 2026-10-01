import { cn } from '@/lib/utils'
import { CROPS, GRID_COLS, type CellScore } from '@/lib/game'

export function HarvestReport({
  title,
  total,
  selected,
  hint,
}: {
  title: string
  total: number
  selected: CellScore | null
  hint: string
}) {
  return (
    <section aria-labelledby="report-heading" className="pixel-frame bg-card p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="report-heading" className="font-mono text-xs">
          {title}
        </h2>
        <span className="font-mono text-sm tabular-nums">{total}</span>
      </div>
      {selected ? (
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-sm font-semibold">
            {CROPS[selected.crop].name}{' '}
            <span className="font-normal text-muted-foreground">
              (row {Math.floor(selected.index / GRID_COLS) + 1}, col {(selected.index % GRID_COLS) + 1})
            </span>
          </p>
          <ul className="flex flex-col">
            {selected.lines.map((line, i) => (
              <li key={i} className="flex justify-between border-b-2 border-dashed border-foreground/30 py-1 text-sm">
                <span>{line.label}</span>
                <span className={cn('tabular-nums font-semibold', line.delta < 0 && 'text-destructive')}>
                  {line.delta > 0 ? `+${line.delta}` : line.delta}
                </span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between pt-1 text-sm font-bold">
            <span>Crop total</span>
            <span className="tabular-nums">{selected.total}</span>
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{hint}</p>
      )}
    </section>
  )
}
