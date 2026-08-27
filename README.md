# ⌨️ Typing Speed Game

A full-stack typing speed game where users complete a sequence of 20 randomly generated letters, receive a **0.5-second penalty for every incorrect key press**, save completed game results, review their history, and compete on a global leaderboard.

The project is built with **React, TypeScript, Bun, GraphQL Yoga, PostgreSQL, Prisma, and Docker Compose**, with JWT-based authentication and automated tests including integration tests against PostgreSQL.

---

## ✨ Features

### Gameplay

* 20 randomly generated lowercase alphabet characters per game
* One character displayed at a time
* Advances only when the correct key is pressed
* Incorrect key presses do not advance the game
* **500ms (0.5s) penalty** for every incorrect key press
* Timer starts when the game begins
* Automatic keyboard/input focus during gameplay
* Progress tracking from `0 / 20` to `20 / 20`
* Final score breakdown
* Personal-best detection
* Local best-score persistence
* Restart / play-again functionality

### Accounts & Data

* User registration and login
* Secure password hashing using bcrypt
* Stateless JWT authentication
* Authenticated game-result submission
* Personal game history
* Personal best score
* Global leaderboard
* User data isolated through authenticated server-side user identity

### Additional UI

* Responsive React interface
* Dark / light theme toggle
* Visual feedback for incorrect key presses

---

## 🛠️ Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Frontend         | React 18 + TypeScript                 |
| Build Tool       | Vite                                  |
| Styling          | Vanilla CSS + CSS custom properties   |
| Backend Runtime  | Bun                                   |
| Backend Language | TypeScript                            |
| API              | GraphQL Yoga                          |
| GraphQL Schema   | GraphQL SDL + `@graphql-tools/schema` |
| Database         | PostgreSQL 16                         |
| ORM              | Prisma                                |
| Authentication   | JWT                                   |
| Password Hashing | bcryptjs                              |
| Testing          | Bun Test                              |
| Infrastructure   | Docker Compose                        |

---

## 🏗️ Architecture

The application follows a simple layered architecture:

```text
┌──────────────────────────────┐
│       React Frontend         │
│                              │
│ Components + Game Hook       │
│ Auth Context + GraphQL Client│
└──────────────┬───────────────┘
               │
               │ GraphQL / HTTP
               ▼
┌──────────────────────────────┐
│       GraphQL Yoga API       │
│                              │
│ Schema → Resolvers           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Service Layer          │
│                              │
│ Auth Service + Game Service  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Prisma ORM            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       PostgreSQL 16          │
└──────────────────────────────┘
```

### Frontend

The frontend is a React single-page application.

* `AuthContext` manages authentication state.
* `useTypingGame` contains the gameplay engine.
* Reusable components handle the character display, timer, progress, result screen, authentication forms, history, and leaderboard.
* A lightweight fetch-based GraphQL client handles API communication.
* Local storage is used for the user's personal best score and authentication token.

### Backend

The backend follows:

```text
GraphQL Schema
      ↓
Resolvers
      ↓
Services
      ↓
Prisma
      ↓
PostgreSQL
```

GraphQL resolvers are kept thin while application/business logic is handled by dedicated service modules.

---

## 📁 Project Structure

```text
typing-speed-game/
├── docker-compose.yml
├── .env.example
├── README.md
├── docs/
│   └── walkthrough.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │       └── 20260827105857_init/
│   │
│   ├── src/
│   │   ├── index.ts
│   │   ├── context.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── game.service.ts
│   │   └── schema/
│   │       ├── schema.graphql
│   │       ├── typeDefs.ts
│   │       └── resolvers/
│   │           ├── auth.resolver.ts
│   │           ├── game.resolver.ts
│   │           └── index.ts
│   │
│   └── tests/
│       ├── auth.test.ts
│       └── game.test.ts
│
└── frontend/
    ├── package.json
    ├── .env.example
    └── src/
        ├── App.tsx
        ├── context/
        │   └── AuthContext.tsx
        ├── hooks/
        │   └── useTypingGame.ts
        ├── graphql/
        │   ├── client.ts
        │   ├── queries.ts
        │   └── mutations.ts
        ├── lib/
        │   └── localStorage.ts
        └── components/
            ├── auth/
            ├── game/
            ├── history/
            └── leaderboard/
```

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Bun](https://bun.sh/)
* Node.js and npm

Docker Desktop is recommended because the provided Docker Compose configuration manages the PostgreSQL database and backend API.

---

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd typing-speed-game
```

---

## 2. Configure Environment Variables

### Root environment

Copy the root environment template:

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

The root `.env` provides the values used by Docker Compose, including the PostgreSQL configuration and JWT secret.

Example structure:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_local_password
POSTGRES_DB=typingspeedgame
DATABASE_URL=postgresql://postgres:your_local_password@localhost:5432/typingspeedgame
JWT_SECRET=replace_with_a_strong_local_secret
```

**Do not commit `.env` to GitHub.**

---

### Backend environment

Copy the backend environment template:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configure the backend values according to the provided template.

---

### Frontend environment

Copy the frontend environment template:

```bash
cp frontend/.env.example frontend/.env
```

On Windows PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

The frontend GraphQL endpoint can use:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

---

# 🐳 Recommended Setup — Docker Compose

The Docker Compose setup runs:

* PostgreSQL 16
* Bun backend / GraphQL API

The React frontend is intentionally run separately during local development.

From the repository root:

```bash
docker compose up -d --build
```

Check the running services:

```bash
docker compose ps
```

The expected services are:

```text
postgres
backend
```

PostgreSQL includes a health check, and the backend waits for PostgreSQL to become healthy before starting.

The backend applies the committed Prisma migrations during container startup using:

```bash
bunx prisma migrate deploy
```

The GraphQL API is available at:

```text
http://localhost:4000/graphql
```

To stop the services:

```bash
docker compose down
```

To stop the services and remove the local PostgreSQL volume:

```bash
docker compose down -v
```

> `docker compose down -v` removes the local PostgreSQL data volume and should only be used when you intentionally want to reset the database.

---

# 🖥️ Start the Frontend

With PostgreSQL and the backend running, open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The frontend communicates with the backend through:

```text
http://localhost:4000/graphql
```

---

# 🔧 Manual Backend Development

If you want to run the backend directly instead of using the backend Docker container, PostgreSQL can still be started through Docker:

```bash
docker compose up postgres -d
```

Then:

```bash
cd backend
bun install
```

Apply the Prisma migrations:

```bash
bunx prisma migrate dev
```

Start the backend:

```bash
bun run dev
```

The GraphQL API will be available at:

```text
http://localhost:4000/graphql
```

---

# 🎮 Game Logic

Each game generates exactly **20 random lowercase alphabet characters**.

The player must type the displayed character correctly before the game advances.

### Input behavior

```text
Correct key
    ↓
Advance to next character

Incorrect key
    ↓
Stay on current character
    ↓
Increment wrong attempts
    ↓
Add 500ms penalty
```

### Scoring

Scores are stored as integer milliseconds.

The final score is calculated as:

```text
Raw Time = End Time - Start Time

Penalty = Wrong Attempts × 500ms

Final Score = Raw Time + Penalty
```

For example, if a game takes `8.40s` and has two incorrect attempts:

```text
Raw Time       = 8.40s
Penalty        = 2 × 0.50s
Penalty        = 1.00s

Final Score    = 9.40s
```

A **lower final score is better**.

The frontend compares the completed game's score against the locally stored personal best. If the new score is lower, it becomes the new local best.

---

# 🔐 Authentication

Authentication uses stateless JWT bearer tokens.

### Registration

```text
User
 ↓
Email/password validation
 ↓
Password hashed with bcrypt
 ↓
User stored in PostgreSQL
 ↓
JWT generated
```

### Login

```text
User credentials
 ↓
User lookup
 ↓
bcrypt password verification
 ↓
JWT generated
```

The JWT is sent with authenticated GraphQL requests using:

```http
Authorization: Bearer <token>
```

The backend verifies the token and derives the authenticated user's identity from the verified JWT context.

Private operations use this server-side identity rather than accepting a client-supplied `userId`.

This prevents a user from requesting another user's private game history by simply changing an ID in the request.

---

# 📡 GraphQL API

GraphQL endpoint:

```text
http://localhost:4000/graphql
```

## Queries

### `hello`

Public API health/check query.

### `me`

Returns the currently authenticated user when a valid token is available.

### `myGameHistory`

**Authentication required.**

Returns the authenticated user's completed games.

### `myBestScore`

**Authentication required.**

Returns the authenticated user's fastest recorded game.

### `leaderboard`

Returns global player rankings based on their best recorded time.

---

## Mutations

### `register`

Creates a new user account and returns authentication information.

### `login`

Authenticates an existing user and returns a JWT.

### `saveGameResult`

**Authentication required.**

Persists a completed game result for the authenticated user.

The server derives ownership from the authenticated JWT context rather than accepting an arbitrary user ID.

---

# 🗄️ Database Design

The application uses PostgreSQL with Prisma ORM.

## User

Stores account information:

```text
User
├── id
├── email
├── passwordHash
└── createdAt
```

`email` is unique.

## GameResult

Stores completed game information:

```text
GameResult
├── id
├── userId
├── totalTimeMs
├── correctCount
├── wrongAttempts
├── penaltyMs
└── createdAt
```

Relationship:

```text
User 1 ─────────── * GameResult
```

Each game result belongs to the user who played it.

---

# 🔄 Prisma Migrations

Database schema changes are tracked through Prisma migrations.

Current migration:

```text
backend/prisma/migrations/
└── 20260827105857_init/
    └── migration.sql
```

For an existing database, migrations are deployed using:

```bash
bunx prisma migrate deploy
```

For local development where schema changes are being developed:

```bash
bunx prisma migrate dev
```

The Docker backend uses the committed migration history rather than `prisma db push`.

---

# 🧪 Testing

The project uses Bun's native test runner.

Run the backend test suite:

```bash
cd backend
bun test
```

The test suite covers important authentication and game functionality, including:

* Invalid email validation
* Password length validation
* User registration
* Email normalization
* Login and password verification
* Unauthorized game-result submission
* Invalid game metrics
* Game-result persistence
* Leaderboard behavior

## PostgreSQL Integration Tests

The project includes integration tests that execute against a **real PostgreSQL database** through Prisma rather than mocking the database layer.

These tests verify real database operations including:

* User persistence
* User lookup during authentication
* Game-result persistence
* Leaderboard data retrieval

The tests clean up their generated test records after execution so they can be run repeatedly without intentionally leaving test data behind.

---

# 📦 Available Commands

## Backend

From `backend/`:

```bash
bun install
```

Development:

```bash
bun run dev
```

Production-style start:

```bash
bun run start
```

Tests:

```bash
bun test
```

Prisma development migration:

```bash
bunx prisma migrate dev
```

Apply committed migrations:

```bash
bunx prisma migrate deploy
```

Prisma Studio:

```bash
bunx prisma studio
```

## Frontend

From `frontend/`:

```bash
npm install
```

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 🔒 Environment & Secrets

The application uses environment variables for configuration and secrets.

Important variables include:

| Variable            | Purpose                             |
| ------------------- | ----------------------------------- |
| `POSTGRES_USER`     | PostgreSQL username                 |
| `POSTGRES_PASSWORD` | PostgreSQL password                 |
| `POSTGRES_DB`       | PostgreSQL database name            |
| `DATABASE_URL`      | Prisma/PostgreSQL connection string |
| `JWT_SECRET`        | JWT signing and verification secret |
| `PORT`              | Backend HTTP port                   |
| `VITE_GRAPHQL_URL`  | Frontend GraphQL API endpoint       |

Real `.env` files should never be committed.

The repository provides `.env.example` templates instead.

---

# 🧠 Key Technical Decisions

### 1. Custom `useTypingGame` hook

Gameplay state and keyboard/timer behavior are encapsulated inside a custom React hook.

This keeps game-specific logic separate from presentation components and makes the main application component easier to maintain.

### 2. Hidden focused input

Keyboard input is captured through a hidden input element.

The game actively restores focus when required so the player can continue typing without repeatedly clicking an input field.

### 3. Integer millisecond scores

Game times are stored as integer milliseconds rather than floating-point seconds.

This makes penalty calculations and score comparisons deterministic:

```text
500ms = 0.5 seconds
```

### 4. JWT-derived user identity

Protected operations derive the user ID from the verified JWT context.

This avoids trusting a client-provided `userId` for private data access.

### 5. Service layer

Business logic is separated from GraphQL resolvers.

The main flow is:

```text
GraphQL
  ↓
Resolver
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

This keeps database and business logic out of the API layer where possible.

---

# ⚖️ Trade-offs & Limitations

The implementation intentionally avoids additional infrastructure that is not required for the assignment.

### Client-calculated game metrics

The frontend calculates the elapsed time, wrong attempts, and penalty before submitting the completed result.

The backend validates the submitted metrics for basic correctness but does not attempt to reconstruct and verify every individual keystroke timing on the server.

A server-authoritative timing system could provide stronger anti-cheating guarantees, but implementing one would add complexity beyond the requirements of this assignment.

### Leaderboard aggregation

Leaderboard grouping and best-time aggregation are currently performed in the Bun service layer.

For the expected scale of this assignment, this keeps the implementation straightforward. At significantly larger scale, this could be moved into database-level aggregation and optimized with appropriate indexes.

---

# 🐳 Docker Services

Docker Compose currently provides:

```text
┌─────────────────────────┐
│ PostgreSQL 16           │
│ localhost:5432          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Bun + GraphQL Yoga      │
│ localhost:4000          │
└─────────────────────────┘
             ▲
             │ GraphQL
┌─────────────────────────┐
│ React + Vite            │
│ localhost:5173          │
└─────────────────────────┘
```

The frontend runs separately during local development, while PostgreSQL and the backend are containerized.

---

# 📋 Assignment Coverage

| Requirement                   | Implementation |
| ----------------------------- | -------------- |
| 20 random characters          | ✅              |
| Correct-key progression       | ✅              |
| 0.5s incorrect-key penalty    | ✅              |
| Timer                         | ✅              |
| Keyboard focus                | ✅              |
| Progress indicator            | ✅              |
| Final score                   | ✅              |
| Local best score              | ✅              |
| Restart / play again          | ✅              |
| User registration             | ✅              |
| User login                    | ✅              |
| Secure password hashing       | ✅              |
| JWT authentication            | ✅              |
| Authenticated game submission | ✅              |
| Private game history          | ✅              |
| Leaderboard                   | ✅              |
| GraphQL API                   | ✅              |
| PostgreSQL                    | ✅              |
| Prisma                        | ✅              |
| Prisma migrations             | ✅              |
| Docker Compose                | ✅              |
| Automated tests               | ✅              |
| PostgreSQL integration tests  | ✅              |
| Environment configuration     | ✅              |
| Error handling & validation   | ✅              |

---

# 🎥 Walkthrough

A technical walkthrough accompanies this repository.

The walkthrough covers:

1. Project overview and user flow
2. Frontend/game architecture
3. Typing and penalty logic
4. Authentication flow
5. GraphQL API design
6. Prisma/PostgreSQL data model
7. Docker setup and migrations
8. PostgreSQL integration testing
9. Key technical decisions
10. Trade-offs and potential future improvements

---

# 🚧 Future Improvements

The current implementation intentionally focuses on the assignment requirements.

If this were developed further, possible improvements would include:

* Server-authoritative game timing
* Database-level leaderboard aggregation for larger datasets
* More extensive end-to-end testing
* More granular API rate limiting
* Production-specific CORS configuration
* Additional game statistics

These are deliberately outside the core implementation to keep the project simple and avoid unnecessary infrastructure.

---

## 📄 License

This project was created as a technical take-home assignment.
