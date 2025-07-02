import type { GameState, Tile, Position, Direction } from "../types/game"
import { generateHexPositions, positionsEqual, DIRECTION_VECTORS } from "./hexGrid"

const GRID_RADIUS = 2 // Creates a 19-tile hexagon (1 center + 2 rings)
const ALL_POSITIONS = generateHexPositions(GRID_RADIUS)

export function createInitialGameState(): GameState {
  const tiles = [createRandomTile(), createRandomTile()]

  return {
    tiles,
    score: 0,
    bestScore: 0,
    gameStatus: "playing",
    moveCount: 0,
  }
}

function createRandomTile(): Tile {
  const emptyPositions = getEmptyPositions([])
  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]

  return {
    id: Math.random().toString(36).substr(2, 9),
    value: Math.random() < 0.9 ? 2 : 4,
    position: randomPosition,
    isNew: true,
  }
}

function getEmptyPositions(tiles: Tile[]): Position[] {
  return ALL_POSITIONS.filter((pos) => !tiles.some((tile) => positionsEqual(tile.position, pos)))
}

export function makeMove(gameState: GameState, direction: Direction): GameState {
  if (gameState.gameStatus === "lost") return gameState

  const { tiles: movedTiles, scoreGained, hasMoved } = moveTiles(gameState.tiles, direction)

  if (!hasMoved) return gameState

  // Add new tile
  const emptyPositions = getEmptyPositions(movedTiles)
  const newTiles = [...movedTiles]

  if (emptyPositions.length > 0) {
    const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
    newTiles.push({
      id: Math.random().toString(36).substr(2, 9),
      value: Math.random() < 0.9 ? 2 : 4,
      position: randomPosition,
      isNew: true,
    })
  }

  const newScore = gameState.score + scoreGained
  const newBestScore = Math.max(gameState.bestScore, newScore)

  // Check win condition
  let newGameStatus = gameState.gameStatus
  if (gameState.gameStatus === "playing" && newTiles.some((tile) => tile.value >= 2048)) {
    newGameStatus = "won"
  }

  // Check lose condition
  if (getEmptyPositions(newTiles).length === 0 && !canMakeAnyMove(newTiles)) {
    newGameStatus = "lost"
  }

  return {
    tiles: newTiles,
    score: newScore,
    bestScore: newBestScore,
    gameStatus: newGameStatus,
    moveCount: gameState.moveCount + 1,
  }
}

function moveTiles(
  tiles: Tile[],
  direction: Direction,
): {
  tiles: Tile[]
  scoreGained: number
  hasMoved: boolean
} {
  const newTiles: Tile[] = []
  let scoreGained = 0
  let hasMoved = false

  // Group tiles by their "lanes" in the movement direction
  const lanes = groupTilesByLanes(tiles, direction)

  for (const lane of lanes) {
    const { movedLane, laneScore, laneMoved } = moveLane(lane, direction)
    newTiles.push(...movedLane)
    scoreGained += laneScore
    hasMoved = hasMoved || laneMoved
  }

  return { tiles: newTiles, scoreGained, hasMoved }
}

function groupTilesByLanes(tiles: Tile[], direction: Direction): Tile[][] {
  const lanes: Map<string, Tile[]> = new Map()

  for (const tile of tiles) {
    const laneKey = getLaneKey(tile.position, direction)
    if (!lanes.has(laneKey)) {
      lanes.set(laneKey, [])
    }
    lanes.get(laneKey)!.push(tile)
  }

  return Array.from(lanes.values())
}

function getLaneKey(position: Position, direction: Direction): string {
  // Create a unique key for tiles that move in the same "lane"
  switch (direction) {
    case "n":
    case "s":
      return `q${position.q}`
    case "ne":
    case "sw":
      return `r${position.r}`
    case "nw":
    case "se":
      return `s${-position.q - position.r}`
    default:
      return `${position.q},${position.r}`
  }
}

function moveLane(
  lane: Tile[],
  direction: Direction,
): {
  movedLane: Tile[]
  laneScore: number
  laneMoved: boolean
} {
  if (lane.length === 0) return { movedLane: [], laneScore: 0, laneMoved: false }

  // Sort tiles by their position in the movement direction
  const sortedTiles = [...lane].sort((a, b) => {
    return getDistanceInDirection(a.position, direction) - getDistanceInDirection(b.position, direction)
  })

  const movedTiles: Tile[] = []
  let laneScore = 0
  let laneMoved = false

  for (let i = 0; i < sortedTiles.length; i++) {
    const tile = sortedTiles[i]
    const newPosition = findFarthestPosition(tile.position, direction, [...movedTiles, ...sortedTiles.slice(i + 1)])

    // Check for merge
    const adjacentTile = movedTiles.find((t) => positionsEqual(t.position, newPosition))

    if (adjacentTile && adjacentTile.value === tile.value && !adjacentTile.isMerged) {
      // Merge tiles
      adjacentTile.value *= 2
      adjacentTile.isMerged = true
      laneScore += adjacentTile.value
      laneMoved = true
    } else {
      // Move tile
      const movedTile = {
        ...tile,
        position: newPosition,
        isNew: false,
        isMerged: false,
      }

      if (!positionsEqual(tile.position, newPosition)) {
        laneMoved = true
      }

      movedTiles.push(movedTile)
    }
  }

  return { movedLane: movedTiles, laneScore, laneMoved }
}

function getDistanceInDirection(position: Position, direction: Direction): number {
  const vector = DIRECTION_VECTORS[direction]
  return position.q * vector.q + position.r * vector.r
}

function findFarthestPosition(start: Position, direction: Direction, obstacles: Tile[]): Position {
  const vector = DIRECTION_VECTORS[direction]
  let current = start
  let next = { q: current.q + vector.q, r: current.r + vector.r }

  while (
    ALL_POSITIONS.some((pos) => positionsEqual(pos, next)) &&
    !obstacles.some((tile) => positionsEqual(tile.position, next))
  ) {
    current = next
    next = { q: current.q + vector.q, r: current.r + vector.r }
  }

  return current
}

function canMakeAnyMove(tiles: Tile[]): boolean {
  const directions: Direction[] = ["n", "ne", "se", "s", "sw", "nw"]

  for (const direction of directions) {
    const { hasMoved } = moveTiles(tiles, direction)
    if (hasMoved) return true
  }

  return false
}

export function continueGame(gameState: GameState): GameState {
  return {
    ...gameState,
    gameStatus: "continue",
  }
}

export function resetGame(bestScore: number): GameState {
  const newState = createInitialGameState()
  return {
    ...newState,
    bestScore,
  }
}
