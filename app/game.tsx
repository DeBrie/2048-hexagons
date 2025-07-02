"use client"

import { useGame } from "../hooks/useGame"
import { useInputHandler } from "../hooks/useInputHandler"
import { GameBoard } from "../components/GameBoard"
import { GameControls } from "../components/GameControls"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

export default function Game() {
  const { gameState, move, isLoading, restart, continueAfterWin } = useGame()
  const gameContainerRef = useRef<HTMLDivElement>(null)

  useInputHandler({
    onMove: move,
    disabled: gameState.gameStatus === "lost" || gameState.gameStatus === "won",
  })

  // Mobile focus and interaction management
  useEffect(() => {
    const gameContainer = gameContainerRef.current
    if (!gameContainer) return

    // Prevent default touch behaviors on the game container
    const preventDefaultTouch = (e: TouchEvent) => {
      // Allow touch events on buttons and interactive elements
      const target = e.target as HTMLElement
      if (target.tagName === "BUTTON" || target.closest("button")) {
        return
      }

      // Prevent default for game area touches
      e.preventDefault()
    }

    // Prevent context menu on long press
    const preventContextMenu = (e: Event) => {
      e.preventDefault()
    }

    // Prevent pull-to-refresh and overscroll
    const preventOverscroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-game-area]")) {
        e.preventDefault()
      }
    }

    // Add event listeners
    gameContainer.addEventListener("touchstart", preventDefaultTouch, { passive: false })
    gameContainer.addEventListener("touchmove", preventDefaultTouch, { passive: false })
    gameContainer.addEventListener("contextmenu", preventContextMenu)
    document.addEventListener("touchmove", preventOverscroll, { passive: false })

    // Focus the game container for keyboard events
    gameContainer.focus()

    return () => {
      gameContainer.removeEventListener("touchstart", preventDefaultTouch)
      gameContainer.removeEventListener("touchmove", preventDefaultTouch)
      gameContainer.removeEventListener("contextmenu", preventContextMenu)
      document.removeEventListener("touchmove", preventOverscroll)
    }
  }, [])

  // Prevent zoom on double tap
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventDoubleTapZoom = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-game-area]")) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchstart", preventZoom, { passive: false })
    document.addEventListener("touchend", preventDoubleTapZoom, { passive: false })

    return () => {
      document.removeEventListener("touchstart", preventZoom)
      document.removeEventListener("touchend", preventDoubleTapZoom)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={gameContainerRef}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4 touch-none select-none"
      tabIndex={0}
      data-game-area
      style={{
        // Prevent iOS Safari bounce effect
        overscrollBehavior: "none",
        // Prevent text selection
        WebkitUserSelect: "none",
        userSelect: "none",
        // Prevent touch callouts
        WebkitTouchCallout: "none",
        // Prevent tap highlight
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">2048 Hexagon</h1>
          <p className="text-gray-600 text-sm">Swipe or use WASD/QE keys to move tiles</p>
        </div>

        <GameControls gameState={gameState} onRestart={restart} onContinue={continueAfterWin} />

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <GameBoard gameState={gameState} size={320} />
          </CardContent>
        </Card>

        {gameState.gameStatus === "lost" && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold text-red-800 mb-2">Game Over!</h2>
              <p className="text-red-600 mb-4">No more moves available</p>
              <Button onClick={restart} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState.gameStatus === "won" && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold text-green-800 mb-2">You Win!</h2>
              <p className="text-green-600 mb-4">You reached 2048!</p>
              <div className="space-x-2">
                <Button onClick={restart} className="bg-green-600 hover:bg-green-700">
                  New Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile-specific instructions */}
        <div className="text-center text-xs text-gray-500 md:hidden">
          <p>Swipe in 6 directions to move tiles</p>
          <p>Pinch gestures disabled for better gameplay</p>
        </div>
      </div>
    </div>
  )
}
