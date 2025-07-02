"use client";

import { useEffect, useCallback } from "react";
import type { Direction } from "../types/game";

interface UseInputHandlerProps {
  onMove: (direction: Direction) => void;
  disabled?: boolean;
}

export function useInputHandler({
  onMove,
  disabled = false,
}: UseInputHandlerProps) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

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
      };

      const direction = keyMap[event.key];
      if (direction) {
        event.preventDefault();
        onMove(direction);
      }
    },
    [onMove, disabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Touch handling for mobile
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled) return;

      const touch = event.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTouch = endEvent.changedTouches[0];
        const deltaX = endTouch.clientX - startX;
        const deltaY = endTouch.clientY - startY;

        const minSwipeDistance = 50;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < minSwipeDistance && absY < minSwipeDistance) return;

        // Determine direction based on angle
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        let direction: Direction;

        if (angle >= -30 && angle < 30) direction = "se";
        else if (angle >= 30 && angle < 90) direction = "s";
        else if (angle >= 90 && angle < 150) direction = "sw";
        else if (angle >= 150 || angle < -150) direction = "nw";
        else if (angle >= -150 && angle < -90) direction = "n";
        else direction = "ne";

        onMove(direction);

        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchend", handleTouchEnd);
    },
    [onMove, disabled]
  );

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    return () => window.removeEventListener("touchstart", handleTouchStart);
  }, [handleTouchStart]);
}
