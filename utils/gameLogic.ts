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
  const vector = DIRECTION_VECTORS[direction]
  let scoreGained = 0
  let hasMoved = false

  // Create a mutable copy of tiles and a map for quick lookups
  let newTiles = tiles.map((t) => ({ ...t, isMerged: false, isNew: false }))
  const tileMap = new Map<string, Tile>()
  const updateTileMap = () => {
    tileMap.clear()
    newTiles.forEach((t) => tileMap.set(`${t.position.q},${t.position.r}`, t))
  }
  updateTileMap()

  // Define traversal order based on direction
  const sortedTiles = [...newTiles].sort((a, b) => {
    if (direction === "n") return a.position.r - b.position.r
    if (direction === "s") return b.position.r - a.position.r
    if (direction === "nw") return a.position.q - b.position.q
    if (direction === "se") return b.position.q - a.position.q
    if (direction === "ne") return a.position.q + a.position.r - (b.position.q + b.position.r)
    if (direction === "sw") return b.position.q + b.position.r - (a.position.q + a.position.r)
    return 0
  })

  for (const tile of sortedTiles) {
    let currentPos = tile.position
    let nextPos = { q: currentPos.q + vector.q, r: currentPos.r + vector.r }

    // Find the farthest possible position
    while (ALL_POSITIONS.some((p) => positionsEqual(p, nextPos)) && !tileMap.has(`${nextPos.q},${nextPos.r}`)) {
      currentPos = nextPos
      nextPos = { q: currentPos.q + vector.q, r: currentPos.r + vector.r }
    }

    // Check for merge
    const blockingTile = tileMap.get(`${nextPos.q},${nextPos.r}`)
    const currentTileInMap = tileMap.get(`${tile.position.q},${tile.position.r}`)

    if (blockingTile && currentTileInMap && blockingTile.value === currentTileInMap.value && !blockingTile.isMerged) {
      // Perform merge
      const mergedValue = blockingTile.value * 2
      scoreGained += mergedValue
      blockingTile.value = mergedValue
      blockingTile.isMerged = true

      // Remove the moved tile
      newTiles = newTiles.filter((t) => t.id !== tile.id)
      hasMoved = true
      updateTileMap()
    } else if (!positionsEqual(tile.position, currentPos)) {
      // Move tile to new position
      if (currentTileInMap) {
        currentTileInMap.position = currentPos
        hasMoved = true
        updateTileMap()
      }
    }
  }

  return { tiles: newTiles, scoreGained, hasMoved }
}

function canMakeAnyMove(tiles: Tile[]): boolean {
  if (tiles.length < ALL_POSITIONS.length) {
    return true // There are empty cells, so a move is always possible
  }

  const tileMap = new Map<string, Tile>()
  tiles.forEach((t) => tileMap.set(`${t.position.q},${t.position.r}`, t))

  for (const tile of tiles) {
    for (const dir in DIRECTION_VECTORS) {
      const vector = DIRECTION_VECTORS[dir as Direction]
      const neighborPos = { q: tile.position.q + vector.q, r: tile.position.r + vector.r }
      const neighbor = tileMap.get(`${neighborPos.q},${neighborPos.r}`)

      if (neighbor && neighbor.value === tile.value) {
        return true // Found a possible merge
      }
    }
  }

  return false // Board is full and no merges are possible
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
