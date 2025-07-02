import type { GameState, Direction } from "../types/game"

export function getGameStatusAnnouncement(gameState: GameState): string {
  switch (gameState.gameStatus) {
    case "won":
      return `Congratulations! You reached 2048! Current score: ${gameState.score}`
    case "lost":
      return `Game over! No more moves available. Final score: ${gameState.score}`
    case "continue":
      return `Continuing game. Current score: ${gameState.score}`
    default:
      return `Playing. Current score: ${gameState.score}`
  }
}

export function getMoveAnnouncement(direction: Direction, scoreGained: number): string {
  const directionNames = {
    n: "north",
    ne: "northeast",
    se: "southeast",
    s: "south",
    sw: "southwest",
    nw: "northwest",
  }

  const announcement = `Moved ${directionNames[direction]}`
  return scoreGained > 0 ? `${announcement}. Gained ${scoreGained} points` : announcement
}

export function getTileDescription(value: number): string {
  return `Tile with value ${value}`
}

export function getGridDescription(gameState: GameState): string {
  const tileCount = gameState.tiles.length
  const maxValue = Math.max(...gameState.tiles.map((t) => t.value))
  return `Hexagonal grid with ${tileCount} tiles. Highest tile value: ${maxValue}`
}
