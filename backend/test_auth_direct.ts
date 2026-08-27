import prisma from "./src/lib/prisma";
import { authService } from "./src/services/auth.service";

async function main() {
  console.log("=== CHECKING ENV VARS ===");
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  console.log("=== TESTING PRISMA CONNECTION ===");
  try {
    const userCount = await prisma.user.count();
    console.log("User count in DB:", userCount);
  } catch (err: any) {
    console.error("PRISMA CONNECTION/QUERY ERROR:", err);
  }

  console.log("=== TESTING AUTH REGISTER ===");
  try {
    const res = await authService.register(`directtest_${Date.now()}@test.com`, "password123");
    console.log("REGISTER RESULT:", res);
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
  }
}

main().finally(() => prisma.$disconnect());
