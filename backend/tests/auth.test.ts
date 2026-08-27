import { describe, it, expect } from "bun:test";
import { authService } from "../src/services/auth.service";

describe("authService unit tests", () => {
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

  it("normalizes emails to lowercase and trimmed string", async () => {
    const testEmail = `test_${Date.now()}@example.com`;
    const result = await authService.register(`  ${testEmail.toUpperCase()}  `, "password123");
    expect(result.user.email).toBe(testEmail.toLowerCase());
    expect(result.token).toBeDefined();
  });

  it("rejects invalid login credentials gracefully", async () => {
    await expect(
      authService.login("nonexistent_user_99999@example.com", "wrongpass")
    ).rejects.toThrow("Invalid email or password");
  });
});



