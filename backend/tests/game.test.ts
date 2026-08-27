import { describe, it, expect, afterAll } from "bun:test";
import { gameService } from "../src/services/game.service";
import { authService } from "../src/services/auth.service";
import prisma from "../src/lib/prisma";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test_jwt_secret_for_integration_testing";
}

describe("gameService integration tests", () => {
  const createdTestEmails: string[] = [];

  afterAll(async () => {
    if (createdTestEmails.length > 0) {
      await prisma.gameResult.deleteMany({
        where: { user: { email: { in: createdTestEmails } } },
      });
      await prisma.user.deleteMany({
        where: { email: { in: createdTestEmails } },
      });
    }
    await prisma.$disconnect();
  });

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

  it("saves a valid game result to PostgreSQL and verifies history and leaderboard", async () => {
    const testEmail = `gametest_${Date.now()}@example.com`;
    createdTestEmails.push(testEmail);

    const userRes = await authService.register(testEmail, "password123");
    const userId = userRes.user.id;

    const gameRes = await gameService.saveGameResult(userId, {
      totalTimeMs: 8500,
      correctCount: 20,
      wrongAttempts: 1,
      penaltyMs: 500,
    });

    expect(gameRes.id).toBeDefined();
    expect(gameRes.userId).toBe(userId);
    expect(gameRes.totalTimeMs).toBe(8500);

    const history = await gameService.getMyGameHistory(userId);
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].totalTimeMs).toBe(8500);

    const bestScore = await gameService.getMyBestScore(userId);
    expect(bestScore).not.toBeNull();
    expect(bestScore?.totalTimeMs).toBe(8500);

    const leaderboard = await gameService.getLeaderboard(10);
    expect(Array.isArray(leaderboard)).toBe(true);
    for (let i = 0; i < leaderboard.length - 1; i++) {
      expect(leaderboard[i].bestTimeMs).toBeLessThanOrEqual(leaderboard[i + 1].bestTimeMs);
    }
  });
});




