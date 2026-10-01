export type CropId =
  | 'corn'
  | 'squash'
  | 'beans'
  | 'lettuce'
  | 'marigold'
  | 'sunflower'
  | 'tomato'
  | 'basil'

export type Trait =
  | 'Heavy Feeder'
  | 'Ground Cover'
  | 'Nitrogen-Fixer'
  | 'Climber'
  | 'Quick Harvest'
  | 'Pest Deterrent'
  | 'Pollinator Attractant'

export interface CropDef {
  id: CropId
  name: string
  baseYield: number
  flowering: boolean
  traits: Trait[]
  effect: string
  sprite: string
}

export const CROPS: Record<CropId, CropDef> = {
  corn: {
    id: 'corn',
    name: 'Corn',
    baseYield: 4,
    flowering: false,
    traits: ['Heavy Feeder'],
    effect: 'Worth 5 if next to a Climber. -2 if not next to a Nitrogen-Fixer.',
    sprite: '/crops/corn.png',
  },
  squash: {
    id: 'squash',
    name: 'Squash',
    baseYield: 3,
    flowering: true,
    traits: ['Ground Cover'],
    effect: 'Worth 5 if next to any crop that is not a Ground Cover.',
    sprite: '/crops/squash.png',
  },
  beans: {
    id: 'beans',
    name: 'Beans',
    baseYield: 2,
    flowering: true,
    traits: ['Nitrogen-Fixer', 'Climber'],
    effect: 'Worth 5 if next to any crop that is not a Nitrogen-Fixer.',
    sprite: '/crops/beans.png',
  },
  lettuce: {
    id: 'lettuce',
    name: 'Lettuce',
    baseYield: 5,
    flowering: false,
    traits: ['Quick Harvest'],
    effect: 'Yield 5 the season it is planted, then 1 in each later season. Replant to reset; moving does not reset.',
    sprite: '/crops/lettuce.png',
  },
  marigold: {
    id: 'marigold',
    name: 'Marigold',
    baseYield: 1,
    flowering: false,
    traits: ['Pest Deterrent'],
    effect: 'Worth 5 if next to any crop. Protects neighbors from pests.',
    sprite: '/crops/marigold.png',
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    baseYield: 1,
    flowering: false,
    traits: ['Pollinator Attractant'],
    effect: 'Worth 5 if next to a Flowering crop.',
    sprite: '/crops/sunflower.png',
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    baseYield: 4,
    flowering: true,
    traits: ['Heavy Feeder'],
    effect: '-2 if not next to a Nitrogen-Fixer.',
    sprite: '/crops/tomato.png',
  },
  basil: {
    id: 'basil',
    name: 'Basil',
    baseYield: 3,
    flowering: false,
    traits: ['Pollinator Attractant'],
    effect: 'Worth 5 if next to a Flowering crop.',
    sprite: '/crops/basil.png',
  },
}

export const CROP_ORDER: CropId[] = [
  'corn',
  'squash',
  'beans',
  'lettuce',
  'marigold',
  'sunflower',
  'tomato',
  'basil',
]

export const CARDS_PER_CROP = 12
export const GRID_COLS = 4
export const GRID_ROWS = 4
export const GRID_SIZE = GRID_COLS * GRID_ROWS
export const PLANTING_SECONDS = 180

export type EventId = 'good-weather' | 'weeds' | 'pests' | 'drought' | 'nutrients' | 'good-weather-2'

export interface EventDef {
  id: EventId
  title: string
  flavor: string
  effects: string[]
}

export const EVENTS: Record<EventId, EventDef> = {
  'good-weather': {
    id: 'good-weather',
    title: 'Good Weather!',
    flavor: 'No major challenges occurred this season.',
    effects: ['No penalties this season.'],
  },
  'good-weather-2': {
    id: 'good-weather-2',
    title: 'Good Weather!',
    flavor: 'Sunshine and gentle rain all season long.',
    effects: ['No penalties this season.'],
  },
  weeds: {
    id: 'weeds',
    title: 'Weed Pressure!',
    flavor: 'Weeds are going wild in your plot!',
    effects: ['-2 yield to every crop that does not neighbor a Ground Cover.'],
  },
  pests: {
    id: 'pests',
    title: 'Pest Outbreak!',
    flavor: 'Your plot is invaded by aphids!',
    effects: ['-2 yield to all crops that do not neighbor a Pest Deterrent.'],
  },
  drought: {
    id: 'drought',
    title: 'Drought!',
    flavor: 'Uh oh! No rain for weeks!',
    effects: ['-2 yield to every crop that does not neighbor a Ground Cover.'],
  },
  nutrients: {
    id: 'nutrients',
    title: 'Nutrient Depletion!',
    flavor: 'The soil in your plot is running low on nutrients.',
    effects: [
      '-2 yield to all Heavy Feeders.',
      '-1 yield to all crops that do not neighbor a Nitrogen-Fixer.',
    ],
  },
}

export const EVENT_DECK: EventId[] = ['good-weather', 'weeds', 'pests', 'drought', 'good-weather-2', 'nutrients']

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export interface PlantedCell {
  crop: CropId
  plantedSeason: number
}

export type Grid = (PlantedCell | null)[]

export function emptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => null)
}

export function neighborIndexes(index: number): number[] {
  const row = Math.floor(index / GRID_COLS)
  const col = index % GRID_COLS
  const result: number[] = []
  if (row > 0) result.push(index - GRID_COLS)
  if (row < GRID_ROWS - 1) result.push(index + GRID_COLS)
  if (col > 0) result.push(index - 1)
  if (col < GRID_COLS - 1) result.push(index + 1)
  return result
}

const hasTrait = (crop: CropId, trait: Trait) => CROPS[crop].traits.includes(trait)

export interface ScoreLine {
  label: string
  delta: number
}

export interface CellScore {
  index: number
  crop: CropId
  lines: ScoreLine[]
  total: number
}

export function scoreCell(grid: Grid, index: number, season: number, event: EventId | null): CellScore | null {
  const cell = grid[index]
  if (!cell) return null
  const { crop } = cell
  const def = CROPS[crop]
  const neighbors = neighborIndexes(index)
    .map((i) => grid[i])
    .filter((c): c is PlantedCell => c !== null)
    .map((c) => c.crop)

  const neighborHas = (trait: Trait) => neighbors.some((n) => hasTrait(n, trait))
  const lines: ScoreLine[] = []

  let comboActive = false
  switch (crop) {
    case 'corn':
      comboActive = neighborHas('Climber')
      break
    case 'squash':
      comboActive = neighbors.some((n) => !hasTrait(n, 'Ground Cover'))
      break
    case 'beans':
      comboActive = neighbors.some((n) => !hasTrait(n, 'Nitrogen-Fixer'))
      break
    case 'marigold':
      comboActive = neighbors.length > 0
      break
    case 'sunflower':
    case 'basil':
      comboActive = neighbors.some((n) => CROPS[n].flowering)
      break
  }

  if (crop === 'lettuce') {
    if (cell.plantedSeason === season) {
      lines.push({ label: 'Fresh lettuce', delta: 5 })
    } else {
      lines.push({ label: 'Base yield', delta: 5 })
      lines.push({ label: 'Past quick harvest', delta: -4 })
    }
  } else if (comboActive) {
    lines.push({ label: 'Combo active', delta: 5 })
  } else {
    lines.push({ label: 'Base yield', delta: def.baseYield })
  }

  if (hasTrait(crop, 'Heavy Feeder') && !neighborHas('Nitrogen-Fixer')) {
    lines.push({ label: 'Hungry (no Nitrogen-Fixer)', delta: -2 })
  }

  // Event protection requires a neighboring crop; crops do not protect themselves.
  if (event === 'weeds' || event === 'drought') {
    if (!neighborHas('Ground Cover')) {
      lines.push({ label: event === 'weeds' ? 'Weeds' : 'Drought', delta: -2 })
    }
  }
  if (event === 'pests') {
    if (!neighborHas('Pest Deterrent')) {
      lines.push({ label: 'Aphids', delta: -2 })
    }
  }
  if (event === 'nutrients') {
    if (hasTrait(crop, 'Heavy Feeder')) lines.push({ label: 'Depleted soil', delta: -2 })
    if (!neighborHas('Nitrogen-Fixer')) {
      lines.push({ label: 'Low nitrogen', delta: -1 })
    }
  }

  const raw = lines.reduce((sum, l) => sum + l.delta, 0)
  // Keep the per-crop zero minimum and make the breakdown add up to the total.
  if (raw < 0) lines.push({ label: 'Minimum yield of 0', delta: -raw })
  return { index, crop, lines, total: Math.max(0, raw) }
}

export function scoreGrid(grid: Grid, season: number, event: EventId | null) {
  const cells = grid.map((_, i) => scoreCell(grid, i, season, event))
  const total = cells.reduce((sum, c) => sum + (c?.total ?? 0), 0)
  return { cells, total }
}

export function countCrops(grid: Grid): Record<CropId, number> {
  const counts = Object.fromEntries(CROP_ORDER.map((c) => [c, 0])) as Record<CropId, number>
  for (const cell of grid) if (cell) counts[cell.crop]++
  return counts
}
