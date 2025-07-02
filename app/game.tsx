"use client"

import { useGame } from "../hooks/useGame"
import { useInputHandler } from "../hooks/useInputHandler"
import { GameBoard } from "../components/GameBoard"
import { GameControls } from "../components/GameControls"
import { getGameStatusAnnouncement } from "../utils/accessibility"

export default function Game() {
  const { gameState, isLoading, move, continueAfterWin, restart } = useGame()

  useInputHandler({
    onMove: move,
    disabled: isLoading || gameState.gameStatus === "lost",
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">2048 Hexagon</h1>
          <p className="text-orange-700">Join tiles with the same number to reach 2048!</p>
        </header>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {getGameStatusAnnouncement(gameState)}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <GameBoard gameState={gameState} size={400} />

          <div className="w-full lg:w-auto">
            <GameControls
              gameState={gameState}
              onRestart={restart}
              onContinue={gameState.gameStatus === "won" ? continueAfterWin : undefined}
            />

            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">How to Play:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Use arrow keys or WASD to move tiles</li>
                <li>• Q/E for diagonal moves</li>
                <li>• Swipe on mobile devices</li>
                <li>• Tiles with same numbers merge</li>
                <li>• Reach 2048 to win!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
