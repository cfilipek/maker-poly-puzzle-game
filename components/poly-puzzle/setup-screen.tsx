'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { RulesPanel } from './rules-panel'

const DEFAULT_NAMES = ['Farmer 1', 'Farmer 2', 'Farmer 3', 'Farmer 4']

export function SetupScreen({ onStart, totalSeasons }: { onStart: (names: string[]) => void; totalSeasons: number }) {
  const [count, setCount] = useState(1)
  const [names, setNames] = useState(DEFAULT_NAMES)

  return (
    <main className="grass-bg min-h-dvh px-4 py-8 md:py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="pixel-frame overflow-hidden bg-card">
          <div className="relative aspect-[16/7] w-full border-b-4 border-foreground">
            <Image
              src="/farm-banner.png"
              alt="Pixel art farm with rows of crops growing in tilled plots"
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="pixelated object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 p-4 md:p-6">
            <h1 className="font-mono text-2xl leading-snug md:text-3xl text-balance">Poly-Puzzle</h1>
            <p className="leading-relaxed text-pretty">
              Plant crop cards on your 4x4 Poly-Plot, chain Combo Effects between neighbors, and survive{' '}
              {totalSeasons} seasons of surprise events. The event deck is shuffled every game and stays face down until
              all plots are locked.
            </p>
          </div>
        </header>

        <form
          className="pixel-frame flex flex-col gap-5 bg-card p-4 md:p-6"
          onSubmit={(e) => {
            e.preventDefault()
            onStart(names.slice(0, count).map((n, i) => n.trim() || DEFAULT_NAMES[i]))
          }}
        >
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-mono text-xs">How many farmers?</legend>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={count === n}
                  onClick={() => setCount(n)}
                  className={cn('pixel-btn min-w-14 bg-muted px-4 py-3 font-mono text-sm', count === n && 'bg-accent')}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: count }, (_, i) => (
              <label key={i} className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Farmer {i + 1} name</span>
                <input
                  value={names[i]}
                  maxLength={16}
                  onChange={(e) => setNames((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))}
                  className="border-3 border-foreground bg-background/20 px-3 py-2 text-base focus:bg-card focus:outline-4 focus:outline-accent"
                />
              </label>
            ))}
          </div>

          <button type="submit" className="pixel-btn self-start bg-primary px-6 py-4 font-mono text-xs text-primary-foreground">
            Start Season 1
          </button>
        </form>

        <RulesPanel />
      </div>
    </main>
  )
}
