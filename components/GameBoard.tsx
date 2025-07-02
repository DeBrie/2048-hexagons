"use client"

import type { GameState } from "../types/game"
import { generateHexPositions, axialToPixel } from "../utils/hexGrid"
import { HexTile } from "./HexTile"

interface GameBoardProps {
  gameState: GameState
  size?: number
}

export function GameBoard({ gameState, size = 400 }: GameBoardProps) {
  const GRID_RADIUS = 2
  const TILE_SIZE = size / 8
  const centerX = size / 2
  const centerY = size / 2

  const allPositions = generateHexPositions(GRID_RADIUS)

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      role="grid"
      aria-label="2048 Hexagon game board"
    >
      <svg width={size} height={size} className="absolute inset-0 overflow-visible" viewBox={`0 0 ${size} ${size}`}>
        {/* Background hexagons */}
        <g className="background-grid">
          {allPositions.map((pos, index) => {
            const { x, y } = axialToPixel(pos, TILE_SIZE * 0.8)
            const actualX = centerX + x
            const actualY = centerY + y

            const points = []
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i
              const px = actualX + TILE_SIZE * 0.7 * Math.cos(angle)
              const py = actualY + TILE_SIZE * 0.7 * Math.sin(angle)
              points.push(`${px},${py}`)
            }

            const pathData = `M ${points.join(" L ")} Z`

            return (
              <path key={`bg-${index}`} d={pathData} fill="#cdc1b4" stroke="#bbada0" strokeWidth="2" opacity="0.5" />
            )
          })}
        </g>

        {/* Tile components are now grouped */}
        <g className="tiles-container">
          {gameState.tiles.map((tile) => (
            <HexTile key={tile.id} tile={tile} size={TILE_SIZE} centerX={centerX} centerY={centerY} />
          ))}
        </g>
      </svg>
    </div>
  )
}
