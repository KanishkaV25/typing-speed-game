import { describe, it, expect, afterAll } from "bun:test";
import { authService } from "../src/services/auth.service";
import prisma from "../src/lib/prisma";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test_jwt_secret_for_integration_testing";
}

describe("authService integration tests", () => {
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

  it("rejects invalid email formats", async () => {
    await expect(authService.register("invalid-email", "password123")).rejects.toThrow(
      "Invalid email format"
    );
    await expect(authService.register("", "password123")).rejects.toThrow("Invalid email format");
  });

  it("rejects short passwords (< 6 chars)", async () => {
    await expect(authService.register("test@example.com", "123")).rejects.toThrow(
      "Password must be at least 6 characters long"
    );
  });

  it("normalizes emails to lowercase and trimmed string and persists user in PostgreSQL", async () => {
    const rawEmail = `  TEST_${Date.now()}@example.com  `;
    const normalizedEmail = rawEmail.trim().toLowerCase();
    createdTestEmails.push(normalizedEmail);

    const result = await authService.register(rawEmail, "password123");
    expect(result.user.email).toBe(normalizedEmail);
    expect(result.token).toBeDefined();

    const dbUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.email).toBe(normalizedEmail);
  });

  it("authenticates existing user with correct credentials and rejects wrong password", async () => {
    const rawEmail = `  LOGIN_TEST_${Date.now()}@example.com  `;
    const normalizedEmail = rawEmail.trim().toLowerCase();
    createdTestEmails.push(normalizedEmail);

    await authService.register(rawEmail, "password123");

    const loginRes = await authService.login(normalizedEmail, "password123");
    expect(loginRes.token).toBeDefined();
    expect(loginRes.user.email).toBe(normalizedEmail);

    await expect(authService.login(normalizedEmail, "wrongpassword")).rejects.toThrow(
      "Invalid email or password"
    );
  });

  it("rejects invalid login credentials for nonexistent user gracefully", async () => {
    await expect(
      authService.login("nonexistent_user_99999@example.com", "wrongpass")
    ).rejects.toThrow("Invalid email or password");
  });
});




