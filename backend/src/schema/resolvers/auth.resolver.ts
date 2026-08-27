import { GraphQLError } from "graphql";
import { authService } from "../../services/auth.service";
import type { AppContext } from "../../context";

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.currentUser) return null;
      try {
        return await authService.getUserById(ctx.currentUser.userId);
      } catch (err: any) {
        throw new GraphQLError(err.message || "Failed to fetch user profile");
      }
    },
  },
  Mutation: {
    register: async (_: unknown, args: { email: string; password: string }) => {
      try {
        return await authService.register(args.email, args.password);
      } catch (err: any) {
        console.error("Register Resolver Error:", err);
        throw new GraphQLError(err.message || "Failed to register account");
      }
    },
    login: async (_: unknown, args: { email: string; password: string }) => {
      try {
        return await authService.login(args.email, args.password);
      } catch (err: any) {
        console.error("Login Resolver Error:", err);
        throw new GraphQLError(err.message || "Invalid credentials");
      }
    },
  },
};




