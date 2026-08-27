import { describe, it, expect } from "bun:test";
import { gameService } from "../src/services/game.service";

describe("gameService unit tests", () => {
  it("rejects unauthorized game saves without userId", async () => {
    await expect(
      gameService.saveGameResult("", {
        totalTimeMs: 12000,
        correctCount: 20,
        wrongAttempts: 2,
        penaltyMs: 1000,
      })
    ).rejects.toThrow("Unauthorized");
  });

  it("rejects invalid metrics (negative penalty or zero time)", async () => {
    await expect(
      gameService.saveGameResult("user-123", {
        totalTimeMs: 0,
        correctCount: 20,
        wrongAttempts: -1,
        penaltyMs: -500,
      })
    ).rejects.toThrow("Invalid game result values");
  });

  it("returns leaderboard entries sorted by fastest time first", async () => {
    const leaderboard = await gameService.getLeaderboard(10);
    expect(Array.isArray(leaderboard)).toBe(true);
    for (let i = 0; i < leaderboard.length - 1; i++) {
      expect(leaderboard[i].bestTimeMs).toBeLessThanOrEqual(leaderboard[i + 1].bestTimeMs);
    }
  });
});



