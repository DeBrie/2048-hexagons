import type { GameState } from "../types/game";

const GAME_STATE_KEY = "hexagon2048-gamestate";
const BEST_SCORE_KEY = "hexagon2048-bestscore";

export function saveGameState(gameState: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    localStorage.setItem(BEST_SCORE_KEY, gameState.bestScore.toString());
  } catch (error) {
    console.warn("Failed to save game state:", error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      const gameState = JSON.parse(saved);
      // Ensure bestScore is loaded separately for consistency
      const bestScore = Number.parseInt(
        localStorage.getItem(BEST_SCORE_KEY) || "0"
      );
      return {
        ...gameState,
        bestScore: Math.max(gameState.bestScore || 0, bestScore),
      };
    }
  } catch (error) {
    console.warn("Failed to load game state:", error);
  }
  return null;
}

export function loadBestScore(): number {
  try {
    return Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0");
  } catch (error) {
    console.warn("Failed to load best score:", error);
    return 0;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.warn("Failed to clear game state:", error);
  }
}
