import type { Position, Direction } from "../types/game"

// Generate all positions for a hexagonal grid with given radius
export function generateHexPositions(radius: number): Position[] {
  const positions: Position[] = []

  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius)
    const r2 = Math.min(radius, -q + radius)
    for (let r = r1; r <= r2; r++) {
      positions.push({ q, r })
    }
  }

  return positions
}

// Convert axial coordinates to pixel coordinates for display
export function axialToPixel(pos: Position, size: number): { x: number; y: number } {
  const x = size * ((3 / 2) * pos.q)
  const y = size * ((Math.sqrt(3) / 2) * pos.q + Math.sqrt(3) * pos.r)
  return { x, y }
}

// Get direction vectors for hexagonal movement
export const DIRECTION_VECTORS: Record<Direction, Position> = {
  n: { q: 0, r: -1 },
  ne: { q: 1, r: -1 },
  se: { q: 1, r: 0 },
  s: { q: 0, r: 1 },
  sw: { q: -1, r: 1 },
  nw: { q: -1, r: 0 },
}

// Get all positions in a direction from a starting position
export function getPositionsInDirection(start: Position, direction: Direction, allPositions: Position[]): Position[] {
  const vector = DIRECTION_VECTORS[direction]
  const positions: Position[] = []

  let current = { q: start.q + vector.q, r: start.r + vector.r }

  while (allPositions.some((pos) => pos.q === current.q && pos.r === current.r)) {
    positions.push({ ...current })
    current = { q: current.q + vector.q, r: current.r + vector.r }
  }

  return positions
}

// Check if two positions are equal
export function positionsEqual(a: Position, b: Position): boolean {
  return a.q === b.q && a.r === b.r
}
