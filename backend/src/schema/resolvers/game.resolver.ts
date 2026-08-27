import { gameService, type SaveGameInput } from "../../services/game.service";
import type { AppContext } from "../../context";

export const gameResolvers = {
  Query: {
    myGameHistory: (_: unknown, args: { limit?: number }, ctx: AppContext) => {
      if (!ctx.currentUser) {
        throw new Error("Unauthorized: Log in to view your game history");
      }
      return gameService.getMyGameHistory(ctx.currentUser.userId, args.limit);
    },
    myBestScore: (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.currentUser) {
        throw new Error("Unauthorized: Log in to view your best score");
      }
      return gameService.getMyBestScore(ctx.currentUser.userId);
    },
    leaderboard: (_: unknown, args: { limit?: number }) => {
      return gameService.getLeaderboard(args.limit);
    },
  },
  Mutation: {
    saveGameResult: (_: unknown, args: SaveGameInput, ctx: AppContext) => {
      if (!ctx.currentUser) {
        throw new Error("Unauthorized: You must be logged in to save a game result");
      }
      return gameService.saveGameResult(ctx.currentUser.userId, args);
    },
  },
};


