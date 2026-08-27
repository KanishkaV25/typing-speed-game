# Technical Walkthrough & Implementation Report

## 📌 Project Overview
This repository contains a full-stack **Typing Speed Game** built to strict assignment specifications using **React (Vite)**, **Bun**, **GraphQL Yoga**, **Prisma ORM**, **PostgreSQL**, and **Docker Compose**.

Users test their typing speed by completing a sequence of 20 randomly generated alphabets (`a-z`). Incorrect keypresses incur a **+0.5 second penalty** added to the total completion time. Lower time represents a better score.

---

## 🏛️ System Architecture & Tech Stack

```
[ Frontend: React + Vite ] ──(GraphQL Over HTTP)──> [ Backend: Bun + GraphQL Yoga ]
          │                                                         │
    (localStorage)                                            (Prisma ORM)
   [ Local Best Cache ]                                             │
                                                          [ PostgreSQL DB ]
```

- **Frontend:** React + Vite, Vanilla CSS design system (glassmorphism, vibrant gradients, responsive dark mode).
- **Backend:** Bun runtime + GraphQL Yoga server (schema-first SDL).
- **Database:** PostgreSQL modeled with Prisma ORM (`User` and `GameResult`).
- **Containerization:** `docker-compose.yml` orchestrating PostgreSQL database and Bun backend.
- **State & Auth:** `AuthContext` + `localStorage` for JWT token and user profile persistence.

---

## 🔑 Key Technical Decisions

### 1. Game Engine & Penalty Calculation (`useTypingGame.ts`)
- **Keystroke Handling:** Captured via a hidden, continuously focused text input element to ensure cross-browser compatibility and prevent unexpected scroll events (`e.preventDefault()`).
- **Timer Resolution:** Driven by `requestAnimationFrame` for smooth 60fps rendering without UI lag.
- **Penalty Logic:** Incorrect keypresses trigger `wrongAttemptsRef.current += 1` synchronously, avoiding asynchronous state race conditions during fast typing. Total time is calculated as:
  $$\text{Total Time} = \text{Raw Elapsed Time} + (\text{Wrong Attempts} \times 500\text{ms})$$
- **High Score Rule:** Lower total completion time indicates a better score. If `totalTimeMs` is lower than the cached `localBest`, `isNewBest` is set to `true` and updated in `localStorage`.

### 2. GraphQL Schema & API Design (`typeDefs.ts`)
The API strictly exposes 7 operations for authentication, game persistence, and leaderboard queries:
- `Query.me`: Retrieves current authenticated user profile.
- `Query.myGameHistory`: Returns user's past game attempts sorted by `createdAt DESC`.
- `Query.myBestScore`: Returns user's single fastest score (`totalTimeMs ASC`).
- `Query.leaderboard`: Public aggregation query grouping best single-game scores by player (`bestTimeMs ASC`).
- `Mutation.register`: Hashes password with `bcryptjs` and returns JWT token.
- `Mutation.login`: Verifies user credentials and returns JWT token.
- `Mutation.saveGameResult`: Authenticated mutation for recording game completions.

### 3. Server-Side Security & Identity Derivation
- Game result submissions derive the `userId` strictly from `context.currentUser.userId` (extracted from the verified HTTP `Authorization: Bearer <token>` header).
- Users cannot submit scores or access private game history on behalf of another user.

---

## 📊 Database Schema (`schema.prisma`)

```prisma
model User {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String
  createdAt    DateTime     @default(now())
  gameResults  GameResult[]
}

model GameResult {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  totalTimeMs   Int
  correctCount  Int
  wrongAttempts Int
  penaltyMs     Int
  createdAt     DateTime @default(now())
}
```

---

## 🧪 Testing Suite (`backend/tests/`)
Unit tests are implemented using Bun's native test runner (`bun test`):
- `auth.test.ts`: Email formatting validation, minimum password length enforcement, duplicate registration handling, invalid login rejection.
- `game.test.ts`: Unauthorized game submission rejection, non-negative metric boundary validation.

---

## 🚀 Running the Project

### Using Docker Compose (Recommended)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Start PostgreSQL and Backend containers
docker compose up

# 3. In a new terminal, start the frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to test the application.

