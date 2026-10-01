import { CloudSun, Bug, Sprout, Sun, Leaf } from 'lucide-react'
import type { EventDef, EventId } from '@/lib/game'

const ICONS: Record<EventId, typeof Sun> = {
  'good-weather': CloudSun,
  'good-weather-2': CloudSun,
  weeds: Sprout,
  pests: Bug,
  drought: Sun,
  nutrients: Leaf,
}

export function EventCard({ season, event }: { season: number; event: EventDef | null }) {
  if (!event) {
    return (
      <section aria-label="Upcoming season event, face down" className="pixel-frame bg-primary p-3 text-primary-foreground">
        <div className="flex aspect-[5/3] flex-col items-center justify-center gap-3 border-3 border-dashed border-primary-foreground/60 p-4 text-center">
          <span aria-hidden="true" className="font-mono text-4xl text-accent">
            ?
          </span>
          <p className="font-mono text-[10px] leading-relaxed">Season {season + 1} Event</p>
          <p className="text-sm leading-relaxed opacity-80">
            Face down. Nobody knows what the season will bring until every plot is locked in.
          </p>
        </div>
      </section>
    )
  }

  const Icon = ICONS[event.id]
  return (
    <section
      key={event.id}
      aria-live="polite"
      aria-label={`Season ${season + 1} event: ${event.title}`}
      className="animate-flip-in pixel-frame bg-card p-3"
    >
      <div className="flex flex-col gap-3 border-3 border-foreground bg-muted p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center border-3 border-foreground bg-accent">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Season {season + 1} Event</p>
            <h2 className="font-mono text-xs leading-relaxed">{event.title}</h2>
          </div>
        </div>
        <p className="leading-relaxed">{event.flavor}</p>
        <ul className="flex flex-col gap-1">
          {event.effects.map((e) => (
            <li key={e} className="border-l-0 bg-card px-2 py-1 text-sm font-semibold leading-relaxed">
              {e}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
