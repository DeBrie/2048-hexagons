"use client"

import { useEffect, useCallback, useRef } from "react"
import type { Direction } from "../types/game"

interface UseInputHandlerProps {
  onMove: (direction: Direction) => void
  disabled?: boolean
}

export function useInputHandler({ onMove, disabled = false }: UseInputHandlerProps) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastMoveRef = useRef<number>(0)

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return

      const keyMap: Record<string, Direction> = {
        ArrowUp: "n",
        ArrowDown: "s",
        ArrowLeft: "nw",
        ArrowRight: "se",
        w: "n",
        W: "n",
        s: "s",
        S: "s",
        a: "nw",
        A: "nw",
        d: "se",
        D: "se",
        q: "sw",
        Q: "sw",
        e: "ne",
        E: "ne",
      }

      const direction = keyMap[event.key]
      if (direction) {
        event.preventDefault()
        onMove(direction)
      }
    },
    [onMove, disabled],
  )

  // Enhanced touch handling for mobile
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled) return

      // Only handle single touch
      if (event.touches.length !== 1) return

      const touch = event.touches[0]
      const target = event.target as HTMLElement

      // Only handle touches on the game area
      if (!target.closest("[data-game-area]")) return

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      // Prevent default to stop scrolling
      event.preventDefault()
    },
    [disabled],
  )

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (disabled || !touchStartRef.current) return

      const touch = event.changedTouches[0]
      const startTouch = touchStartRef.current
      const deltaX = touch.clientX - startTouch.x
      const deltaY = touch.clientY - startTouch.y
      const deltaTime = Date.now() - startTouch.time

      // Reset touch start
      touchStartRef.current = null

      // Minimum swipe distance and maximum time for gesture recognition
      const minSwipeDistance = 30
      const maxSwipeTime = 1000
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Check if it's a valid swipe
      if ((absX < minSwipeDistance && absY < minSwipeDistance) || deltaTime > maxSwipeTime) {
        return
      }

      // Throttle moves to prevent rapid firing
      const now = Date.now()
      if (now - lastMoveRef.current < 150) return
      lastMoveRef.current = now

      // Determine direction based on angle (improved for hexagonal movement)
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI
      let direction: Direction

      // Map angles to hexagonal directions with better precision
      if (angle >= -30 && angle < 30) {
        direction = "se" // Right
      } else if (angle >= 30 && angle < 90) {
        direction = "s" // Down
      } else if (angle >= 90 && angle < 150) {
        direction = "sw" // Down-left
      } else if (angle >= 150 || angle < -150) {
        direction = "nw" // Left
      } else if (angle >= -150 && angle < -90) {
        direction = "n" // Up
      } else {
        direction = "ne" // Up-right
      }

      onMove(direction)
      event.preventDefault()
    },
    [onMove, disabled],
  )

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Prevent scrolling during touch moves on game area
    const target = event.target as HTMLElement
    if (target.closest("[data-game-area]")) {
      event.preventDefault()
    }
  }, [])

  useEffect(() => {
    // Keyboard events
    window.addEventListener("keydown", handleKeyPress)

    // Touch events with proper options
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
      capture: true,
    })
    document.addEventListener("touchend", handleTouchEnd, {
      passive: false,
      capture: true,
    })
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    })

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("touchstart", handleTouchStart, true)
      document.removeEventListener("touchend", handleTouchEnd, true)
      document.removeEventListener("touchmove", handleTouchMove, true)
    }
  }, [handleKeyPress, handleTouchStart, handleTouchEnd, handleTouchMove])

  // Handle visibility change to maintain focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refocus game when returning to tab
        const gameArea = document.querySelector("[data-game-area]") as HTMLElement
        if (gameArea) {
          gameArea.focus()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])
}
