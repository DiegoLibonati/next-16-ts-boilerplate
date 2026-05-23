# Next 16 Ts Mongo Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Next 16 Ts Mongo Boilerplate** is a production-ready starting point for building full-stack web applications with Next.js, TypeScript, and MongoDB. It is not a UI kit or a framework — it is the foundation you clone once and stop rebuilding from scratch on every new project.

**The problem it solves:** every Next.js + TypeScript project starts with the same repetitive decisions — how to structure a full-stack codebase, how to separate server logic from client logic, where to put types, how to handle authentication, how to connect to a database safely, and how to deploy the whole thing with Docker and nginx. This boilerplate answers all of those decisions upfront, with a consistent, layered architecture that scales to real applications without introducing unnecessary complexity.

**What it includes:**

- **Next.js 16 + React 19 + TypeScript 5** — App Router with Turbopack for local development and optimized standalone builds for production. Strict typing enforced throughout; no `any`, consistent type imports, explicit return types required.
- **MongoDB + Mongoose** — connection managed with a global cache safe for Next.js hot-reload. Includes a seed mechanism that populates the database on first run.
- **Cookie-based JWT authentication** — full session model documented in [Architecture & Design Patterns](#architecture--design-patterns).
- **Layered server architecture** — each domain (users, products, auth) has a Model, a DAO (data access), a Service (business logic), and a Controller (request handling). API routes are thin delegators that call the controller and nothing else.
- **Frontend service layer** — plain async modules in `src/services/` that wrap `fetch`, throw typed errors on non-ok responses, and keep all API communication out of Client Components.
- **Context + Provider + custom hook pattern** — demonstrated with a counter feature showing how to scope a provider to a specific route, enforce provider usage at the type level, and expose a clean hook API without prop-drilling.
- **Centralized type system** — all TypeScript interfaces live in `src/types/`, split by concern (props, states, contexts, hooks, domain models, API shapes, env variables). Environment variables are parsed and typed once in `src/server/configs/env.config.ts` with lazy memoization to avoid build-time evaluation failures.
- **Docker support** — separate `dev.docker-compose.yml` (with hot reload via webpack polling) and `prod.docker-compose.yml` (multi-stage build, standalone output, nginx reverse proxy). Production containers run as non-root users.
- **nginx reverse proxy** — production nginx config with gzip compression, security headers, and long-lived immutable cache for static assets.
- **Jest 30 + Testing Library** — full test suite with `ts-jest`, `jest-environment-jsdom`, `@testing-library/react`, and `@testing-library/user-event`. Supertest available for API route integration tests.
- **ESLint + Prettier + Husky + lint-staged** — pre-commit hooks block commits with linting errors and auto-format staged files. No manual formatting steps required.

**How to use it:**

1. Clone the repository and install dependencies.
2. Rename the project in `package.json` and update the title in `src/app/layout.tsx`.
3. Set your environment variables following `.env.example`.
4. Replace the template pages, components, services, models, and context with your own domain logic — the folder structure, auth setup, type conventions, database connection, and tooling stay exactly as they are.

## Technologies Used

1. Next.js 16
2. React JS
3. TypeScript
4. CSS3
5. MongoDB
6. Docker
7. Nginx

## Libraries Used

### Dependencies

```
"@node-rs/bcrypt": "^1.10.0"
"jose": "^5.4.0"
"mongoose": "^8.4.1"
"next": "^16.0.0"
"pino": "^10.3.1"
"react": "^19.0.0"
"react-dom": "^19.0.0"
"zod": "^4.4.3"
```

### DevDependencies

```
"@eslint/eslintrc": "^3.0.0"
"@eslint/js": "^9.0.0"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/react": "^16.0.1"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/react": "^19.2.14"
"@types/react-dom": "^19.2.3"
"@types/supertest": "^6.0.2"
"eslint": "^9.0.0"
"eslint-config-next": "^16.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.5.5"
"eslint-plugin-react-hooks": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"msw": "2.10.4"
"pino-pretty": "^13.1.3"
"prettier": "^3.0.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"undici": "^7.25.0"
```

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/) (the `engines` field in `package.json` enforces this)
- A running MongoDB instance — either a local install, MongoDB Atlas, or the bundled [Dev Docker environment](#dev-docker-environment) under Production

### Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in the values (see [Env Keys](#env-keys) for the full reference):

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

> Prefer a fully containerized dev workflow with MongoDB included? See [Dev Docker environment](#dev-docker-environment).

### Pre-Commit for Development

The project enforces code quality at commit time so no formatter or linter step is ever manual.

#### ESLint

Configured with TypeScript strict rules (`typescript-eslint` recommended + strictTypeChecked + stylisticTypeChecked) and Next.js core web vitals rules:

- Explicit return types required on all functions
- No `any` type allowed (relaxed inside `__tests__/`)
- Consistent type imports enforced (`import type`)
- No unused variables (leading `_` exempted)
- `interface` preferred over `type` for object shapes
- `===` required, no `var`, `prefer-const`
- `no-console` warned, `no-debugger` blocked
- React hooks rules enforced
- Prettier formatting applied as an ESLint error

Manual commands:

```bash
npm run lint        # check src/
npm run lint:fix    # auto-fix src/
npm run lint:all    # auto-fix src/ + __tests__/
```

#### Prettier

Automatic code formatting on save and on commit:

- 2 spaces indentation
- Semicolons required
- Double quotes
- Trailing commas (ES5)
- Print width: 100 characters
- Arrow function parentheses always included
- LF line endings

Manual commands:

```bash
npm run format        # format src/
npm run format:check  # verify formatting in src/
npm run format:all    # format src/ + __tests__/
```

#### Husky + lint-staged

The `prepare` script installs Husky on `npm install`. The pre-commit hook runs `lint-staged`, which:

- Runs ESLint with auto-fix on staged `.ts` and `.tsx` files
- Formats staged `.ts`, `.tsx`, `.css`, `.json`, and `.md` files with Prettier
- Blocks the commit if linting errors remain after auto-fix

## Env Keys

The `.env` file referenced in [Getting Started](#getting-started) is parsed and validated at runtime by `src/server/configs/env.config.ts`. The full set of supported keys is listed below.

| Key                                 | Description                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `MONGO_HOST`                        | MongoDB host. Use `boilerplate-db` when running inside Docker.                                        |
| `MONGO_PORT`                        | MongoDB port.                                                                                         |
| `MONGO_USER`                        | MongoDB root username.                                                                                |
| `MONGO_PASS`                        | MongoDB root password.                                                                                |
| `MONGO_DB_NAME`                     | Name of the database to connect to.                                                                   |
| `MONGO_AUTH_SOURCE`                 | Database used for authentication (typically `admin`).                                                 |
| `JWT_SECRET`                        | Secret used to sign and verify JWT tokens. Use a long random string in production.                    |
| `LOG_LEVEL`                         | Pino log level: `fatal`/`error`/`warn`/`info`/`debug`/`trace`/`silent`. Default `info`.               |
| `RATE_LIMIT_WINDOW_MS`              | Window for the in-memory rate limiter (ms). Default `900000` (15 min).                                |
| `RATE_LIMIT_MAX`                    | Max requests per IP per window on `/api/v1/auth/login`. `0` disables. Default `0`.                    |
| `BODY_LIMIT`                        | Max accepted request body size (e.g. `100kb`, `1mb`, `1gb`). Default `1gb`.                           |
| `SEED_DEFAULT_DATA`                 | If `true`, seeds demo users/products on first connection when collections are empty. Default `false`. |
| `NEXT_PUBLIC_APP_URL`               | Public base URL of the application. Used for client-side fetch calls.                                 |
| `NEXT_REDIRECT_IF_ROUTE_NOT_EXISTS` | If `true`, redirects to home when a route doesn't exist. If `false`, shows 404 page.                  |
| `WATCHPACK_POLLING`                 | Set to `true` to enable polling-based file watching. Required on some WSL2 setups.                    |

Reference values for local development:

```bash
MONGO_HOST=boilerplate-db
MONGO_PORT=27017
MONGO_USER=root
MONGO_PASS=pass
MONGO_DB_NAME=boilerplate_db
MONGO_AUTH_SOURCE=admin
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_REDIRECT_IF_ROUTE_NOT_EXISTS=false
# WATCHPACK_POLLING=true
```

> Never commit `.env` to version control. Use `.env.example` as the reference template. Production-specific values are documented in [Configure `.env` for production](#configure-env-for-production).

## Project Structure

```
next-16-ts-mongo-boilerplate/
├── __tests__/                          # Test suite
│   ├── __mocks__/                      # Shared mock data and module mocks
│   ├── jest.globalSetup.ts             # Global setup (runs once before all tests)
│   ├── jest.globalTeardown.ts          # Global teardown (runs once after all tests)
│   └── jest.setup.ts                   # Per-file setup (jest-dom matchers)
├── public/                             # Static assets served as-is
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── app/                            # Next.js App Router root
│   │   ├── (pages)/                    # Route group for UI pages
│   │   │   ├── about/                  # /about page
│   │   │   ├── context-demo/           # /context-demo page
│   │   │   ├── login/                  # /login page
│   │   │   ├── products/               # /products page
│   │   │   │   └── [id]/               # /products/:id page
│   │   │   └── users/                  # /users page
│   │   ├── api/v1/                     # REST API routes (thin delegators)
│   │   │   ├── auth/login/             # POST /api/v1/auth/login
│   │   │   ├── auth/logout/            # POST /api/v1/auth/logout
│   │   │   ├── health/live/            # GET  /api/v1/health/live   (liveness probe)
│   │   │   ├── health/ready/           # GET  /api/v1/health/ready  (readiness probe)
│   │   │   ├── products/[id]/          # GET  /api/v1/products/:id
│   │   │   └── users/                  # GET  /api/v1/users
│   │   ├── layout.tsx                  # Root layout (fonts, metadata)
│   │   ├── page.tsx                    # Home page
│   │   ├── not-found.tsx               # 404 page
│   │   ├── error.tsx                   # Error boundary
│   │   ├── manifest.ts                 # Web app manifest
│   │   └── robots.ts                   # Robots.txt
│   ├── components/                     # Reusable UI components
│   │   ├── Action/                     # Button/action wrapper component
│   │   ├── CounterWidget/              # Counter with context demo
│   │   ├── Link/                       # Anchor/Next.js link component
│   │   ├── LoginForm/                  # Login form component
│   │   ├── LogoutButton/               # Logout action component
│   │   └── UserCard/                   # User profile card component
│   ├── contexts/                       # React context definitions and providers
│   │   └── CounterContext/             # Counter state context + provider
│   ├── hooks/                          # Custom React hooks
│   │   └── useCounterContext.tsx       # Hook to consume CounterContext
│   ├── server/                         # Server-only code (never imported by Client Components)
│   │   ├── configs/                    # Server configuration
│   │   │   ├── env.config.ts           # Lazy zod-validated env loader with memoization
│   │   │   ├── jwt.config.ts           # Memoized encoded JWT secret (Edge-safe)
│   │   │   ├── logger.config.ts        # Pino singleton (pretty in dev, JSON in prod)
│   │   │   └── mongo.config.ts         # MongoDB connection with global cache
│   │   ├── constants/                  # Response codes, messages, and shared values
│   │   ├── controllers/                # Request handling — validates input, calls service
│   │   │   ├── auth.controller.ts
│   │   │   ├── health.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── daos/                       # Data access objects — typed Mongoose queries
│   │   │   ├── product.dao.ts
│   │   │   └── user.dao.ts
│   │   ├── errors/                     # Typed AppError subclasses (BadRequest, NotFound, etc.)
│   │   ├── helpers/                    # Stateless server utility functions
│   │   │   ├── get_exception_message.helper.ts
│   │   │   ├── get_session.helper.ts
│   │   │   ├── id_to_string.helper.ts
│   │   │   ├── require_env.helper.ts
│   │   │   ├── serialize.helper.ts
│   │   │   └── validate.helper.ts      # zod validateBody / validateParams / validateQuery
│   │   ├── models/                     # Mongoose schema and model definitions
│   │   │   ├── product.model.ts
│   │   │   └── user.model.ts
│   │   ├── schemas/                    # Zod schemas — one file per domain
│   │   │   ├── auth.schema.ts
│   │   │   ├── product.schema.ts
│   │   │   └── user.schema.ts
│   │   ├── services/                   # Business logic layer — one service per domain
│   │   │   ├── auth.service.ts
│   │   │   ├── health.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── user.service.ts
│   │   └── startup/                    # Tasks run on first database connection
│   │       └── seed.startup.ts         # Seeds the database if empty (gated by SEED_DEFAULT_DATA)
│   ├── proxy.ts                        # Next.js 16 proxy (formerly middleware) — auth + CSRF
│   ├── services/                       # Client-side fetch wrappers (used in Client Components)
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   └── userService.ts
│   └── types/                          # TypeScript type definitions split by concern
│       ├── api.ts                      # API document types and response shapes
│       ├── app.ts                      # Domain model types (IUser, IProduct)
│       ├── constants.ts                # Constant key types (codes, messages)
│       ├── contexts.ts                 # Context value types
│       ├── cross.ts                    # Shared primitive types (Env, etc.)
│       ├── env.ts                      # Env variable types
│       ├── helpers.ts                  # Helper function return types
│       ├── hooks.ts                    # Hook return types
│       ├── models.ts                   # Mongoose model types
│       ├── zod.ts                      # Inferred types from zod schemas (request payloads, params)
│       ├── props.ts                    # Component prop types
│       ├── responses.ts                # API response types
│       └── states.ts                   # Component state types
├── .github/workflows/ci.yml            # GitHub Actions pipeline (lint, test, build, docker)
├── .editorconfig                       # Cross-editor whitespace / EOL / charset rules
├── .nvmrc                              # Node version pin (consumed by nvm and CI)
├── .npmrc                              # `engine-strict=true` — enforces `engines.node`
├── .vscode/extensions.json             # Recommended VS Code extensions
├── .env.example                        # Reference template for environment variables
├── dev.docker-compose.yml              # Docker Compose for development
├── prod.docker-compose.yml             # Docker Compose for production
├── Dockerfile.development              # Development image
├── Dockerfile.production               # Multi-stage production image (standalone)
├── Dockerfile.nginx                    # Non-root nginx image
├── nginx.conf                          # nginx reverse proxy configuration
├── eslint.config.js                    # ESLint flat config
├── jest.config.js                      # Jest configuration
├── next.config.ts                      # Next.js configuration (typed)
└── tsconfig.app.json                   # TypeScript compiler config
```

| Folder / File             | Description                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `__tests__/`              | All test files and shared mocks                                                        |
| `__tests__/__mocks__/`    | Reusable mock data for tests                                                           |
| `src/app/`                | Next.js App Router — pages, layouts, and API routes                                    |
| `src/app/(pages)/`        | Route group containing all UI pages                                                    |
| `src/app/api/v1/`         | REST API routes — each file only delegates to a controller                             |
| `src/components/`         | Presentational components reused across pages                                          |
| `src/contexts/`           | React Context definitions and their Provider components                                |
| `src/hooks/`              | Custom hooks that encapsulate context consumption or reusable logic                    |
| `src/server/`             | Server-only code — never imported by Client Components                                 |
| `src/server/configs/`     | Database connection and lazy env variable loader                                       |
| `src/server/controllers/` | Validates request input, calls the service, and returns the HTTP response              |
| `src/server/daos/`        | Typed Mongoose queries — no business logic, only data access                           |
| `src/server/models/`      | Mongoose schema and model definitions                                                  |
| `src/server/services/`    | Business logic layer — one service per domain                                          |
| `src/server/schemas/`     | Zod schemas for request bodies, params, and query strings                              |
| `src/server/helpers/`     | Stateless server utility functions (serialization, session, validation, error mapping) |
| `src/server/errors/`      | Typed `AppError` subclasses (`BadRequestError`, `NotFoundError`, etc.)                 |
| `src/server/startup/`     | Tasks executed on first database connection (e.g. database seeding)                    |
| `src/services/`           | Client-side `fetch` wrappers — one module per API resource                             |
| `src/types/`              | TypeScript interfaces and types, split by concern                                      |
| `dev.docker-compose.yml`  | Development stack with hot reload (webpack polling)                                    |
| `prod.docker-compose.yml` | Production stack — app, nginx reverse proxy, and MongoDB                               |
| `Dockerfile.production`   | Three-stage build: install → build → minimal runner                                    |
| `Dockerfile.nginx`        | Non-root nginx image with gzip and security headers                                    |
| `nginx.conf`              | Reverse proxy config with static asset caching and WebSocket support                   |

## Architecture & Design Patterns

### Layered Server Architecture

The server side is organized into four explicit layers. Each layer has a single responsibility and only communicates with the layer directly below it:

```
API Route (route.ts)
    └── Controller          ← validates input, handles HTTP
        └── Service         ← business logic
            └── DAO         ← database queries
                └── Model   ← Mongoose schema
```

- **API Route** — the Next.js `route.ts` file is a thin delegator. It calls the controller and returns the result. No logic lives here.
- **Controller** — reads and validates the request, calls the appropriate service method, and returns a structured HTTP response. Error handling via a centralized `getExceptionMessage` helper.
- **Service** — contains all business logic (hashing passwords, signing tokens, domain rules). It calls DAOs to access data and never touches the HTTP layer.
- **DAO (Data Access Object)** — typed wrappers around Mongoose queries. No business logic — only reads and writes to the database.
- **Model** — Mongoose schema and model definition. The single source of truth for the document shape and validation rules.

---

### Server / Client Separation

Next.js distinguishes between Server Components (run on the server, can access the database directly) and Client Components (run in the browser, must communicate via API). This project enforces a strict boundary:

- **Server Components** call `src/server/services/` directly — no fetch, no network round-trip.
- **Client Components** call `src/services/` — plain `fetch` wrappers that hit the API routes.
- Everything under `src/server/` is server-only and is never imported by any Client Component.

---

### Design Patterns

**DAO (Data Access Object)**
Each domain has a dedicated DAO (`user.dao.ts`, `product.dao.ts`) that encapsulates all Mongoose queries. Business logic in services never calls `Model.find()` directly — it goes through the DAO. This makes queries easy to swap, mock in tests, and read in isolation.

**Service Layer**
Business logic is fully isolated in service modules. Controllers do not make decisions — they delegate to services. This means the same service method can be called from an API route, a Server Component, or a startup script without any changes.

**Context + Provider + Custom Hook**
Client-side shared state follows a three-piece pattern: a Context that defines the shape, a Provider that owns the state and wraps the subtree, and a custom hook (`useCounterContext`) that enforces the provider is present and exposes a clean API. Components never consume context directly.

**Lazy Initialization (Memoization)**
`getEnvs()` in `env.config.ts` uses a module-level `_envs` variable to cache the result after the first call. This prevents `requireEnv()` from being evaluated at module load time — which would cause Next.js builds to fail because server modules are analyzed without runtime environment variables available.

**Singleton (Global Cache)**
The MongoDB connection uses a `global._mongooseCache` object to persist the connection across Next.js hot-reloads in development. Without this, each file change would open a new connection and exhaust the pool.

**Centralized Error Mapping**
`getExceptionMessage()` maps any thrown value — Mongoose `CastError`, `ValidationError`, or unknown — to a consistent `{ status, code, message }` shape. Controllers call this helper in their catch blocks, so error response formatting is never duplicated across routes.

**Authentication & Session Model**
Cookie-based JWT authentication implemented in `src/server/services/auth.service.ts` and consumed via `src/server/helpers/get_session.helper.ts`:

- Passwords are hashed with `@node-rs/bcrypt` (maintained, native Rust binding) before being stored — plain text passwords never reach the database.
- JWT tokens are signed and verified with `jose` using the secret defined in `JWT_SECRET`. Signing sets `iss` (`nextjs-app`) and `aud` (`nextjs-app`); verification enforces `algorithms: ["HS256"]`, `issuer`, and `audience` to prevent algorithm-confusion attacks. The encoded secret is memoized once per process in `src/server/configs/jwt.config.ts`.
- Tokens are stored in an `auth-token` `HttpOnly` cookie (name centralized in `src/server/constants/vars.constant.ts` as `COOKIE_NAME`), making them inaccessible to JavaScript in the browser and mitigating XSS-driven token exfiltration.
- The cookie is set with `Secure` in production and `SameSite=Lax`.
- **CSRF defense:** `src/proxy.ts` rejects any non-`GET`/`HEAD`/`OPTIONS` request to `/api/*` whose `Origin` header does not match the request `Host` (or `x-forwarded-host` when behind nginx). This is the same Origin-check Server Actions perform internally. Same-origin posture only — cross-origin API consumers must use the `Bearer` token path explicitly.
- **Rate limiting:** `src/proxy.ts` includes an in-memory `Map<ip, bucket>` limiter scoped to `POST /api/v1/auth/login`. Configured via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` (`0` disables). Single-instance only — for multi-instance deployments swap for a shared store (Redis/Upstash).
- `getSession()` is the single entry point for reading the current user — usable in any Server Component or API route. An invalid or expired token returns `null`; no exceptions propagate to the caller.

**Security Headers**
Set at the framework level in `next.config.ts` via `headers()` so they apply in `npm run dev`, `npm run start`, and behind nginx alike (nginx's `add_header` block in `nginx.conf` is an additional outer layer):

- `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `X-DNS-Prefetch-Control: on`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` — production only.

CSP is intentionally left unset (Next.js inline scripts/styles need a nonce-based middleware to enable CSP without breaking the App Router). Add via `proxy.ts` if/when needed.

**Structured Logging**
`pino` is the singleton logger at `src/server/configs/logger.config.ts`. Controllers and startup code log via `logger.error({ err, ctx }, "message")` instead of `console.error`. In development, `pino-pretty` transforms output to a human-readable format with colors and timestamps; in production, JSON is emitted to stdout for log shippers (Loki/CloudWatch/Datadog). The log level is controlled by `LOG_LEVEL`.

> Edge runtime note: `src/proxy.ts` keeps `console.warn` for its security events (CSRF, auth, rate-limit) because `pino` does not run in Edge runtime. Vercel and Docker stdout collectors ingest these lines normally.

## Testing

The test suite uses Jest 30 with `ts-jest`, `jest-environment-jsdom`, and Testing Library. Supertest is wired in for API route integration tests, and MSW (`msw`) is set up for mocking outgoing HTTP calls in client-side service tests. `undici` is pulled in as a polyfill so MSW can intercept `fetch` under jsdom.

```bash
npm run test           # run the full suite
npm run test:watch     # watch mode
npm run test:coverage  # generate the coverage report
```

Tests live under `__tests__/`. Shared mock data and MSW handlers sit under `__tests__/__mocks__/`. The test database lifecycle is managed through `__tests__/jest.globalSetup.ts` and `__tests__/jest.globalTeardown.ts`. `__tests__/jest.setup.ts` loads `@testing-library/jest-dom` matchers, starts the MSW server, and tracks `MessageChannel` instances so React 19's scheduler does not leak open handles on teardown. Cross-runtime polyfills required by MSW + jsdom live in `__tests__/jest.polyfills.ts` and `__tests__/jest.polyfills-undici.ts`.

## Security Audit

Before any release, scan the dependency tree for known vulnerabilities:

```bash
npm audit
```

Apply automatic remediations where possible:

```bash
npm audit fix
```

Review any remaining advisories manually and decide whether to upgrade, override, or accept the risk before moving on to [Build](#build).

## Build

With tests green and the dependency tree clean, produce the optimized production bundle:

```bash
npm run build
```

This runs `tsc -p tsconfig.app.json && next build`:

1. **`tsc`** type-checks the project against `tsconfig.app.json` (strict mode). The build aborts on any type error before Next.js touches the code.
2. **`next build`** produces the optimized App Router bundle under `.next/`. The project is configured for **standalone output**, generating a self-contained `.next/standalone/` directory that includes only the runtime files actually required to serve requests — this is what gets copied into the production image.

The same pipeline is reproduced inside `Dockerfile.production` as a three-stage build:

- **`deps`** — installs packages with `npm ci` against the lockfile.
- **`builder`** — runs `tsc` + `next build` to produce the standalone output.
- **`runner`** — copies only the standalone artifact and runs as a non-root user. The final image contains no source code, devDependencies, or build tooling.

To run the locally built output without Docker:

```bash
npm run start
```

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch and is composed of four sequential jobs — each one only starts if the previous one succeeded.

### Pipeline overview

```
                      ┌─── PR or push to main ───┐
                      ▼                          ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│   lint-and-audit     │─▶│       test       │─▶│      build       │─▶│    docker-build      │
│ eslint · prettier ·  │  │ jest (jsdom +    │  │ tsc + next build │  │ matrix: dev / prod / │
│ tsc · npm audit      │  │ docker compose)  │  │ (standalone)     │  │ nginx · buildx       │
└──────────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────────┘
```

### Validation jobs (run on every PR and push to `main`)

1. **`lint-and-audit`** — `npm run lint` (ESLint with `typescript-eslint` strictTypeChecked + Next.js core-web-vitals), `npm run format:check` (Prettier), `npm run type-check` (`tsc --noEmit` against `tsconfig.app.json`), and `npm audit --audit-level=high` (advisory; runs with `continue-on-error: true` so a transitive high advisory does not block the rest of the pipeline — review the job log if it warns).
2. **`test`** — `npm test`. The Mongo container required by integration tests is brought up automatically inside `__tests__/jest.globalSetup.ts` via `docker compose -f test.docker-compose.yml up` and torn down in `jest.globalTeardown.ts`, so no extra service block is needed in the workflow.
3. **`build`** — runs `npm run build` (`tsc -p tsconfig.app.json && next build`) against dummy CI env values (`JWT_SECRET`, `MONGO_*`) so the zod-validated env loader and the eager `getEnvs()` call in `logger.config.ts` do not throw. Validates that the standalone bundle compiles end-to-end.
4. **`docker-build`** — builds `Dockerfile.development`, `Dockerfile.production`, and `Dockerfile.nginx` in a parallel matrix using [`docker/setup-buildx-action`](https://github.com/docker/setup-buildx-action) + [`docker/build-push-action`](https://github.com/docker/build-push-action). `push: false` — this is a smoke test, not a registry publish. `fail-fast: false` so one broken Dockerfile does not mask issues in the others.

### Node version & strict engines

The Node version used by every job is read from [`.nvmrc`](.nvmrc) by `actions/setup-node` (`node-version-file: .nvmrc`). [`.npmrc`](.npmrc) sets `engine-strict=true`, so the `engines.node` constraint in `package.json` is enforced both in CI and on local `npm install`. Bump `.nvmrc` and `engines.node` together when you upgrade Node.

### Running the same checks locally

```bash
# lint-and-audit
npm run lint
npm run format:check
npm run type-check
npm audit --audit-level=high

# test
npm test

# build
npm run build

# docker-build (one image at a time)
docker build -f Dockerfile.development -t next-16-ts-mongo-boilerplate:dev .
docker build -f Dockerfile.production  -t next-16-ts-mongo-boilerplate:prod .
docker build -f Dockerfile.nginx       -t next-16-ts-mongo-boilerplate-nginx:latest .
```

### Where the build outputs live

| Output                         | Location                                        |
| ------------------------------ | ----------------------------------------------- |
| Validation logs (lint, tests)  | **Actions** tab on GitHub                       |
| `next build` artifacts         | Ephemeral, inside the runner — not uploaded     |
| Docker images built in CI      | Ephemeral, inside the runner — `push: false`    |
| Production-ready Docker images | Built locally or in a separate publish pipeline |

> **Note:** This pipeline is validation-only — it does not push images to a registry or cut releases. If you need to publish to GHCR / Docker Hub, add a `publish` job gated on `github.ref == 'refs/heads/main'` that runs `docker/login-action` + `docker/build-push-action` with `push: true`.

### Skipping CI

To push a change to `main` without running the workflow (e.g. a `.gitignore` tweak), append GitHub's standard `[skip ci]` marker to the commit message:

```bash
git commit -m "docs: fix typo in README [skip ci]"
```

## Production

Deploying to production assumes the previous sections have already passed: tests green ([Testing](#testing)), no critical advisories ([Security Audit](#security-audit)), and a clean local build ([Build](#build)). This section adds only what is new on top: a `.env` configured with production values, and a Docker stack that wraps the app behind nginx with a managed MongoDB container.

### Dev Docker environment

`dev.docker-compose.yml` is an alternative to the local `npm run dev` flow that bundles MongoDB in a container and runs Next.js with webpack + polling for cross-platform hot reload.

```bash
docker compose -f dev.docker-compose.yml up --build
```

The application will be available at `http://localhost:3000`.

> **WSL2 users:** uncomment `WATCHPACK_POLLING=true` in `.env` if hot reload does not pick up file changes.

### Prod Docker stack

The production setup runs three containers orchestrated by `prod.docker-compose.yml`:

| Container           | Image                   | Role                                      |
| ------------------- | ----------------------- | ----------------------------------------- |
| `boilerplate-nginx` | `nginx:stable-alpine`   | Reverse proxy, public entry point (8080)  |
| `boilerplate-app`   | `Dockerfile.production` | Next.js standalone server (internal only) |
| `boilerplate-db`    | `mongo:7.0`             | MongoDB database (internal only)          |

Only nginx is exposed to the outside world. The app and database containers are internal to the Docker network. The app image itself is documented under [Build](#build).

#### Configure `.env` for production

Production values differ from the local development reference shown in [Env Keys](#env-keys). At minimum override these:

```env
MONGO_HOST=boilerplate-db        # must match the db service name in docker-compose
MONGO_PORT=27017
MONGO_USER=root
MONGO_PASS=<strong-password>
MONGO_DB_NAME=boilerplate_db
MONGO_AUTH_SOURCE=admin
JWT_SECRET=<long-random-secret>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### Deploy

```bash
docker compose -f prod.docker-compose.yml up --build -d
```

The application will be available at `http://localhost:8080` (or your server's IP/domain on port 8080).

#### How the stack behaves

- **`Dockerfile.nginx`** runs as a non-root user (`appuser`). The `user nginx;` directive is removed from the main nginx config so it can bind to port 8080 without root privileges.
- **nginx** proxies all traffic to the app container. Static assets under `/_next/static/` are cached for 1 year (immutable). Images and fonts are cached for 1 day. HTML responses are never cached.
- **MongoDB** starts with a health check; the app container waits until the database is ready before starting (`depends_on: condition: service_healthy`).
- **Data** is persisted in the `mongo-prod-data` named volume — it survives container restarts and rebuilds.

#### Useful commands

```bash
# View running containers
docker compose -f prod.docker-compose.yml ps

# Follow logs
docker compose -f prod.docker-compose.yml logs -f

# Stop all services
docker compose -f prod.docker-compose.yml down

# Stop and remove volumes (wipes the database)
docker compose -f prod.docker-compose.yml down -v

# Rebuild after code changes
docker compose -f prod.docker-compose.yml up --build --force-recreate -d
```

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/next-16-ts-mongo-boilerplate`](https://www.diegolibonati.com.ar/#/project/next-16-ts-mongo-boilerplate)
