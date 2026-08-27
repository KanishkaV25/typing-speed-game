import { PrismaClient } from "@prisma/client";

// Singleton PrismaClient — only instantiated once across the entire backend.
// Import from this file everywhere; never instantiate PrismaClient elsewhere.
const prisma = new PrismaClient();

export default prisma;
