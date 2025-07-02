"use client"

import { useState, useEffect, useCallback } from "react"
import type { GameState, Direction } from "../types/game"
import { createInitialGameState, makeMove, continueGame, resetGame } from "../utils/gameLogic"
import { saveGameState, loadGameState, loadBestScore } from "../utils/persistence"

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize with default state, will be updated in useEffect
    const initial = createInitialGameState()
    return { ...initial, bestScore: loadBestScore() }
  })

  const [isLoading, setIsLoading] = useState(true)

  // Load saved game state on mount
  useEffect(() => {
    const savedState = loadGameState()
    if (savedState) {
      setGameState(savedState)
    } else {
      const bestScore = loadBestScore()
      setGameState((prev) => ({ ...prev, bestScore }))
    }
    setIsLoading(false)
  }, [])

  // Save game state whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveGameState(gameState)
    }
  }, [gameState, isLoading])

  const move = useCallback((direction: Direction) => {
    setGameState((prevState) => makeMove(prevState, direction))
  }, [])

  const continueAfterWin = useCallback(() => {
    setGameState((prevState) => continueGame(prevState))
  }, [])

  const restart = useCallback(() => {
    setGameState((prevState) => resetGame(prevState.bestScore))
  }, [])

  return {
    gameState,
    isLoading,
    move,
    continueAfterWin,
    restart,
  }
}
