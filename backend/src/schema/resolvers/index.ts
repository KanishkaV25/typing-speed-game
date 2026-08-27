import { authResolvers } from "./auth.resolver";
import { gameResolvers } from "./game.resolver";

export const resolvers = {
  Query: {
    hello: () => "Hello from Typing Speed Game API 👋",
    me: authResolvers.Query.me,
    myGameHistory: gameResolvers.Query.myGameHistory,
    myBestScore: gameResolvers.Query.myBestScore,
    leaderboard: gameResolvers.Query.leaderboard,
  },
  Mutation: {
    register: authResolvers.Mutation.register,
    login: authResolvers.Mutation.login,
    saveGameResult: gameResolvers.Mutation.saveGameResult,
  },
};



