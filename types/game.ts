export interface Position {
  q: number // axial coordinate q
  r: number // axial coordinate r
}

export interface Tile {
  id: string
  value: number
  position: Position
  isNew?: boolean
  isMerged?: boolean
}

export interface GameState {
  tiles: Tile[]
  score: number
  bestScore: number
  gameStatus: "playing" | "won" | "lost" | "continue"
  moveCount: number
}

export type Direction = "n" | "ne" | "se" | "s" | "sw" | "nw"

export interface GameStats {
  currentScore: number
  bestScore: number
  moveCount: number
  gameStatus: string
}
