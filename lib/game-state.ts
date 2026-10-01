import {
  CARDS_PER_CROP,
  countCrops,
  EVENT_DECK,
  emptyGrid,
  scoreGrid,
  shuffle,
  type CropId,
  type EventId,
  type Grid,
} from './game'

export interface Player {
  id: string
  name: string
  grid: Grid
  tally: number[]
}

export type Phase = 'setup' | 'plant' | 'reveal' | 'final'

export interface GameState {
  phase: Phase
  season: number
  events: EventId[]
  players: Player[]
  activePlayer: number
}

export type GameAction =
  | { type: 'start'; names: string[] }
  | { type: 'plant'; index: number; crop: CropId }
  | { type: 'move'; from: number; to: number }
  | { type: 'remove'; index: number }
  | { type: 'clear' }
  | { type: 'selectPlayer'; player: number }
  | { type: 'reveal' }
  | { type: 'nextSeason' }
  | { type: 'restart' }

export const initialState: GameState = {
  phase: 'setup',
  season: 0,
  events: [],
  players: [],
  activePlayer: 0,
}

export const TOTAL_SEASONS = EVENT_DECK.length

function isValidPlotIndex(grid: Grid, index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < grid.length
}

function updateActiveGrid(state: GameState, update: (grid: Grid) => Grid | null): GameState {
  if (state.phase !== 'plant') return state
  const player = state.players[state.activePlayer]
  if (!player) return state
  const next = update([...player.grid])
  if (!next) return state
  const players = state.players.map((p, i) => (i === state.activePlayer ? { ...p, grid: next } : p))
  return { ...state, players }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start':
      return {
        phase: 'plant',
        season: 0,
        events: shuffle(EVENT_DECK),
        activePlayer: 0,
        players: action.names.map((name, i) => ({
          id: `farmer-${i}`,
          name,
          grid: emptyGrid(),
          tally: [],
        })),
      }

    case 'plant':
      return updateActiveGrid(state, (grid) => {
        if (!isValidPlotIndex(grid, action.index)) return null
        const existing = grid[action.index]

        // Selecting Lettuce on an old lettuce plot explicitly replants it.
        // The old card is returned and reused, so inventory does not increase.
        if (existing?.crop === action.crop) {
          if (action.crop !== 'lettuce' || existing.plantedSeason === state.season) return null
          grid[action.index] = { crop: action.crop, plantedSeason: state.season }
          return grid
        }
        const counts = countCrops(grid)
        if (counts[action.crop] >= CARDS_PER_CROP) return null
        grid[action.index] = { crop: action.crop, plantedSeason: state.season }
        return grid
      })

    case 'move':
      return updateActiveGrid(state, (grid) => {
        if (!isValidPlotIndex(grid, action.from) || !isValidPlotIndex(grid, action.to)) return null
        if (action.from === action.to) return null
        const from = grid[action.from]
        const to = grid[action.to]
        if (!from) return null
        // Rearranging crops is not replanting: both crops keep their age.
        grid[action.to] = from
        grid[action.from] = to ?? null
        return grid
      })

    case 'remove':
      return updateActiveGrid(state, (grid) => {
        if (!isValidPlotIndex(grid, action.index) || !grid[action.index]) return null
        grid[action.index] = null
        return grid
      })

    case 'clear':
      return updateActiveGrid(state, () => emptyGrid())

    case 'selectPlayer':
      return { ...state, activePlayer: action.player }

    case 'reveal': {
      if (state.phase !== 'plant') return state
      const event = state.events[state.season]
      const players = state.players.map((p) => ({
        ...p,
        tally: [...p.tally, scoreGrid(p.grid, state.season, event).total],
      }))
      return { ...state, phase: 'reveal', players }
    }

    case 'nextSeason': {
      if (state.phase !== 'reveal') return state
      if (state.season + 1 >= TOTAL_SEASONS) return { ...state, phase: 'final' }
      return { ...state, phase: 'plant', season: state.season + 1, activePlayer: 0 }
    }

    case 'restart':
      return initialState
  }
}
