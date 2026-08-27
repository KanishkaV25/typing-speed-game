FROM oven/bun:1.1-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install

# Copy source
COPY . .

# Generate Prisma client
RUN bunx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]

