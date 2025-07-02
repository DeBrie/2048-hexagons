"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { GameState } from "../types/game"

interface GameControlsProps {
  gameState: GameState
  onRestart: () => void
  onContinue?: () => void
}

export function GameControls({ gameState, onRestart, onContinue }: GameControlsProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-2xl font-bold" aria-live="polite">
              {gameState.score.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Best</div>
            <div className="text-2xl font-bold">{gameState.bestScore.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onRestart} variant="outline" className="flex-1 bg-transparent" aria-label="Start new game">
            New Game
          </Button>

          {gameState.gameStatus === "won" && onContinue && (
            <Button onClick={onContinue} className="flex-1" aria-label="Continue playing after reaching 2048">
              Continue
            </Button>
          )}
        </div>

        {gameState.gameStatus === "won" && (
          <div className="text-center p-3 bg-green-100 text-green-800 rounded-lg" role="alert" aria-live="assertive">
            🎉 You Win! You reached 2048!
          </div>
        )}

        {gameState.gameStatus === "lost" && (
          <div className="text-center p-3 bg-red-100 text-red-800 rounded-lg" role="alert" aria-live="assertive">
            😔 Game Over! No more moves available.
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>Use arrow keys or WASD to move tiles</p>
          <p>Swipe on mobile devices</p>
        </div>
      </CardContent>
    </Card>
  )
}
