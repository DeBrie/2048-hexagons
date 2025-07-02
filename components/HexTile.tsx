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
  // Calculate the target position
  const { x, y } = axialToPixel(tile.position, size * 0.8)
  const targetX = centerX + x
  const targetY = centerY + y

  // Define the hexagon shape relative to a (0,0) center
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const px = size * 0.7 * Math.cos(angle)
    const py = size * 0.7 * Math.sin(angle)
    points.push(`${px},${py}`)
  }
  const pathData = `M ${points.join(" L ")} Z`

  // Determine tile color and text style
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

  // Apply the correct animation class based on the tile's state
  const animationClass = tile.isNew ? "animate-tile-spawn" : tile.isMerged ? "animate-tile-merge" : ""

  return (
    <g
      // Use CSS transform for smooth animation of position
      style={{
        transform: `translate(${targetX}px, ${targetY}px)`,
        transition: "transform 0.15s ease-in-out",
      }}
      className={animationClass}
      role="gridcell"
      aria-label={`Tile with value ${tile.value}`}
    >
      <path d={pathData} fill={getColor(tile.value)} stroke="#bbada0" strokeWidth="2" className="drop-shadow-sm" />
      <text
        x={0}
        y={0}
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
