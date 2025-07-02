"use client"

import type { Tile } from "../types/game"
import { axialToPixel } from "../utils/hexGrid"

interface HexTileProps {
  tile: Tile
  size: number
  centerX: number
  centerY: number
}

export function HexTile({ tile, size, centerX, centerY }: HexTileProps) {
  const { x, y } = axialToPixel(tile.position, size * 0.8)
  const actualX = centerX + x
  const actualY = centerY + y

  // Create hexagon path
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const px = actualX + size * 0.7 * Math.cos(angle)
    const py = actualY + size * 0.7 * Math.sin(angle)
    points.push(`${px},${py}`)
  }

  const pathData = `M ${points.join(" L ")} Z`

  // Color based on tile value
  const getColor = (value: number) => {
    const colors = {
      2: "#eee4da",
      4: "#ede0c8",
      8: "#f2b179",
      16: "#f59563",
      32: "#f67c5f",
      64: "#f65e3b",
      128: "#edcf72",
      256: "#edcc61",
      512: "#edc850",
      1024: "#edc53f",
      2048: "#edc22e",
    }
    return colors[value as keyof typeof colors] || "#3c3a32"
  }

  const textColor = tile.value <= 4 ? "#776e65" : "#f9f6f2"
  const fontSize = tile.value >= 1000 ? size * 0.25 : size * 0.3

  return (
    <g
      className={`transition-all duration-200 ${tile.isNew ? "animate-pulse" : ""} ${tile.isMerged ? "animate-bounce" : ""}`}
      role="gridcell"
      aria-label={`Tile with value ${tile.value}`}
    >
      <path d={pathData} fill={getColor(tile.value)} stroke="#bbada0" strokeWidth="2" className="drop-shadow-sm" />
      <text
        x={actualX}
        y={actualY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
        fill={textColor}
        className="select-none font-mono"
      >
        {tile.value}
      </text>
    </g>
  )
}
