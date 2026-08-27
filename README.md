# ⌨️ Typing Speed Game

A full-stack, real-time typing speed web application with user authentication, live gameplay mechanics (penalty calculations), score persistence, and a global leaderboard.

---

## 🎯 Features

- **Real-Time Gameplay Engine**: Clean 20-character target sequence with instant visual key feedback (correct, wrong, upcoming).
- **Penalty Logic**: Each incorrect keypress adds a **+0.5s (500ms) penalty** to the final score time.
- **User Authentication**: Secure JWT-based registration and login with `bcryptjs` password hashing.
- **Global Leaderboard**: Ranks players by best time (including penalties).
- **Personal History**: Gated user dashboard to view past game performances.
- **Dark / Light Theme Toggle**: Persistent theme mode preference stored in local storage.

---

## 🛠️ Tech Stack & Delivery Checklist

| Component | Technology | File Location |
| :--- | :--- | :--- |
| **Frontend** | React (Vite, TypeScript, CSS Variables) | `frontend/` |
| **Backend** | Bun, GraphQL Yoga, `@graphql-tools/schema` | `backend/` |
| **GraphQL Schema** | SDL Type Definitions | `backend/src/schema/schema.graphql` & `typeDefs.ts` |
| **Database ORM** | PostgreSQL & Prisma ORM | `backend/prisma/schema.prisma` |
| **DB Migrations** | Prisma SQL Migrations | `backend/prisma/migrations/` |
| **Containerization** | Docker Compose (PostgreSQL + Backend) | `docker-compose.yml` |
| **Testing** | Bun Test Suite | `backend/tests/` |
| **Environment Specs** | Environment Variable Templates | `.env.example`, `backend/.env.example`, `frontend/.env.example` |

---

## 📁 Repository Structure

```text
typing-speed-game/
├── docker-compose.yml          # Container orchestration (PostgreSQL + Backend API)
├── README.md                   # Setup & project documentation
├── .env.example                # Root environment template
├── backend/
│   ├── Dockerfile              # Backend production container build
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma       # Database models (User, GameResult)
│   │   └── migrations/         # Database SQL migrations
│   ├── src/
│   │   ├── index.ts            # Bun + GraphQL Yoga HTTP entrypoint
│   │   ├── context.ts          # Auth context & JWT token verifier
│   │   ├── schema/
│   │   │   ├── schema.graphql  # Standard GraphQL SDL Schema
│   │   │   ├── typeDefs.ts     # Schema type definitions
│   │   │   └── resolvers/      # Resolvers (auth, game, leaderboard)
│   │   ├── services/           # Business logic layer
│   │   └── lib/                # Database client (Prisma)
│   └── tests/                  # Backend unit & integration test suite
└── frontend/
    ├── package.json
    ├── .env.example            # Frontend environment configuration
    └── src/
        ├── App.tsx             # Main React UI component & view state
        ├── context/            # Auth context provider & state
        ├── components/         # Game, Auth, Leaderboard & History components
        ├── hooks/              # Custom gameplay engine hook (`useTypingGame`)
        └── graphql/            # GraphQL Client queries & mutations
```

---

## 🚀 Quick Start Guide (Local Setup)

### 1. Environment Setup
Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

*Example Root `.env`:*
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DB=typingspeedgame
DATABASE_URL="postgresql://postgres:changeme@localhost:5432/typingspeedgame"
JWT_SECRET=supersecretjwtkey_change_this_in_production
```

Copy `frontend/.env.example` to `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

---

### 2. Option A: Run via Docker Compose (Recommended)

To spin up both the **PostgreSQL database** and the **GraphQL Backend** with a single command:

```bash
docker compose up -d --build
```

- **GraphQL API Server**: [http://localhost:4000/graphql](http://localhost:4000/graphql)

Next, start the React frontend:

```bash
cd frontend
npm install
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)

---

### 3. Option B: Run Locally with Bun (Manual Mode)

If you prefer running services directly on your host machine:

#### Step 3.1: Start PostgreSQL
```bash
docker compose up postgres -d
```

#### Step 3.2: Setup & Run Backend
```bash
cd backend
bun install
bunx prisma migrate dev --name init
bun run dev
```

#### Step 3.3: Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests

The test suite validates authentication hashing, JWT signing, and game result score calculations (including error penalty additions).

To run backend tests:

```bash
cd backend
bun test
```

*Sample Test Output:*
```text
bun test v1.1.0
backend/tests/auth.test.ts:
  ✓ Auth Service > should register a new user successfully
  ✓ Auth Service > should reject login with invalid credentials
backend/tests/game.test.ts:
  ✓ Game Logic > should calculate total time with penalties correctly

 3 pass
 0 fail
```

---

## 📊 GraphQL API Overview

### Queries
- `me`: Get current authenticated user details.
- `myGameHistory`: Retrieve history of game attempts for the logged-in user.
- `myBestScore`: Retrieve user's fastest score record.
- `leaderboard(limit: Int)`: Top global rankings sorted by `totalTimeMs` + `penaltyMs`.

### Mutations
- `register(email, password)`: Register new account and return JWT token.
- `login(email, password)`: Authenticate user and return JWT token.
- `saveGameResult(totalTimeMs, correctCount, wrongAttempts, penaltyMs)`: Auth-gated mutation to persist score.

---

## 🛡️ Engineering Best Practices

1. **Separation of Concerns**: Clean architecture with service layers (`auth.service.ts`, `game.service.ts`), isolated GraphQL resolvers, and dedicated React custom hooks (`useTypingGame`).
2. **Schema-First GraphQL**: Explicit GraphQL SDL schema with strict payload validation.
3. **Data Integrity & Security**: `bcryptjs` password hashing with salt rounds, stateless JWT authorization via HTTP headers, and strict foreign key relations in Prisma.
4. **Resilient UX**: Dynamic CSS variable themes (dark/light), optimistic UI states, and automatic refocusing during gameplay.
