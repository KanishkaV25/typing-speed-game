import type { YogaInitialContext } from "graphql-yoga";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  email: string;
}

export interface AppContext {
  currentUser: AuthUser | null;
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return secret;
}


export async function buildContext(ctx: YogaInitialContext): Promise<AppContext> {
  const authHeader = ctx.request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  if (!token) {
    return { currentUser: null };
  }

  try {
    const secret = getJwtSecret();
    const payload = jwt.verify(token, secret) as Partial<AuthUser>;
    if (!payload.userId || !payload.email) {
      return { currentUser: null };
    }
    return { currentUser: { userId: payload.userId, email: payload.email } };
  } catch {
    return { currentUser: null };
  }
}

