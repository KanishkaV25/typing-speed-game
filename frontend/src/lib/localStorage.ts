// Phase 3 — localStorage best-score helpers
// Placeholder for now.

const BEST_SCORE_KEY = "typing_best_score_ms";

export function getLocalBestScore(): number | null {
  const raw = localStorage.getItem(BEST_SCORE_KEY);
  if (raw === null) return null;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? null : parsed;
}

export function setLocalBestScore(ms: number): void {
  const current = getLocalBestScore();
  // Lower = better
  if (current === null || ms < current) {
    localStorage.setItem(BEST_SCORE_KEY, String(ms));
  }
}

export function clearLocalBestScore(): void {
  localStorage.removeItem(BEST_SCORE_KEY);
}
