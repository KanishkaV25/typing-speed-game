import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { getJwtSecret } from "../context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const authService = {
  async register(emailInput: string, passwordInput: string) {
    const email = typeof emailInput === "string" ? emailInput.trim().toLowerCase() : "";
    const password = typeof passwordInput === "string" ? passwordInput : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      const secret = getJwtSecret();
      const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
        expiresIn: "7d",
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
      };
    } catch (e: any) {
      console.error("DEBUG AUTH REGISTER CATCH:", e);
      if (
        e.message?.includes("already exists") ||
        e.message?.includes("Invalid email") ||
        e.message?.includes("Password must")
      ) {
        throw e;
      }
      if (e.code === "P2002") {
        throw new Error("User with this email already exists");
      }
      throw new Error(`DB Error: ${e.message || String(e)}`);
    }
  },

  async login(emailInput: string, passwordInput: string) {
    const email = typeof emailInput === "string" ? emailInput.trim().toLowerCase() : "";
    const password = typeof passwordInput === "string" ? passwordInput : "";

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const secret = getJwtSecret();
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    };
  },

  async getUserById(userId: string) {
    if (!userId || typeof userId !== "string") return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  },
};


