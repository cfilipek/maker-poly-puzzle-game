'use client'

import { useEffect, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANTING_SECONDS } from '@/lib/game'

export function SeasonTimer() {
  const [secondsLeft, setSecondsLeft] = useState(PLANTING_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  const mins = Math.floor(secondsLeft / 60)
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const urgent = secondsLeft <= 30

  return (
    <div className="flex items-center gap-2">
      <div
        role="timer"
        aria-label={`Planting time left: ${mins} minutes ${secs} seconds`}
        className={cn(
          'pixel-frame-sm min-w-24 bg-card px-3 py-2 text-center font-mono text-xs',
          urgent && 'bg-destructive text-card',
        )}
      >
        {secondsLeft === 0 ? "TIME'S UP" : `${mins}:${secs}`}
      </div>
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        disabled={secondsLeft === 0}
        aria-label={running ? 'Pause timer' : 'Start timer'}
        className="pixel-btn bg-accent p-2"
      >
        {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={() => {
          setRunning(false)
          setSecondsLeft(PLANTING_SECONDS)
        }}
        aria-label="Reset timer"
        className="pixel-btn bg-card p-2"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
