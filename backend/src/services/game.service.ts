import prisma from "../lib/prisma";

export interface SaveGameInput {
  totalTimeMs: number;
  correctCount: number;
  wrongAttempts: number;
  penaltyMs: number;
}

export const gameService = {
  async saveGameResult(userId: string, input: SaveGameInput) {
    if (!userId) {
      throw new Error("Unauthorized: User ID is required");
    }

    if (!input) {
      throw new Error("Invalid input: Game result data is missing");
    }

    const { totalTimeMs, correctCount, wrongAttempts, penaltyMs } = input;

    if (
      typeof totalTimeMs !== "number" ||
      typeof correctCount !== "number" ||
      typeof wrongAttempts !== "number" ||
      typeof penaltyMs !== "number" ||
      totalTimeMs <= 0 ||
      correctCount < 0 ||
      wrongAttempts < 0 ||
      penaltyMs < 0
    ) {
      throw new Error("Invalid game result values");
    }

    const record = await prisma.gameResult.create({
      data: {
        userId,
        totalTimeMs: Math.round(totalTimeMs),
        correctCount: Math.round(correctCount),
        wrongAttempts: Math.round(wrongAttempts),
        penaltyMs: Math.round(penaltyMs),
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      totalTimeMs: record.totalTimeMs,
      correctCount: record.correctCount,
      wrongAttempts: record.wrongAttempts,
      penaltyMs: record.penaltyMs,
      createdAt: record.createdAt.toISOString(),
    };
  },

  async getMyGameHistory(userId: string, limit: number = 20) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const take = Math.min(Math.max(1, limit), 100);
    const records = await prisma.gameResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      totalTimeMs: r.totalTimeMs,
      correctCount: r.correctCount,
      wrongAttempts: r.wrongAttempts,
      penaltyMs: r.penaltyMs,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  async getMyBestScore(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Lower totalTimeMs = better score! Order by totalTimeMs ASC
    const record = await prisma.gameResult.findFirst({
      where: { userId },
      orderBy: { totalTimeMs: "asc" },
    });

    if (!record) return null;

    return {
      id: record.id,
      userId: record.userId,
      totalTimeMs: record.totalTimeMs,
      correctCount: record.correctCount,
      wrongAttempts: record.wrongAttempts,
      penaltyMs: record.penaltyMs,
      createdAt: record.createdAt.toISOString(),
    };
  },

  async getLeaderboard(limitInput?: number | null) {
    const limit = limitInput && limitInput > 0 ? Math.min(limitInput, 50) : 10;

    // Fetch game results with user relation
    const results = await prisma.gameResult.findMany({
      include: {
        user: true,
      },
    });

    // Group by user ID to find minimum best time & count total games
    const userMap = new Map<
      string,
      {
        userId: string;
        email: string;
        bestTimeMs: number;
        gamesPlayed: number;
      }
    >();

    for (const r of results) {
      const email = r.user?.email || "Anonymous";
      const existing = userMap.get(r.userId);
      if (!existing) {
        userMap.set(r.userId, {
          userId: r.userId,
          email,
          bestTimeMs: r.totalTimeMs,
          gamesPlayed: 1,
        });
      } else {
        existing.gamesPlayed += 1;
        if (r.totalTimeMs < existing.bestTimeMs) {
          existing.bestTimeMs = r.totalTimeMs;
        }
      }
    }

    // Sort by bestTimeMs ASC (fastest players first!)
    const leaderboardEntries = Array.from(userMap.values()).sort(
      (a, b) => a.bestTimeMs - b.bestTimeMs
    );

    return leaderboardEntries.slice(0, limit);
  },

};


