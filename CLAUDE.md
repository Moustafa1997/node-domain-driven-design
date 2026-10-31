# CLAUDE.md

Guidance for working in this repository.

## Project

**Travelhoop** — a Domain-Driven Design **modular monolith** in Node.js /
TypeScript, maintained by **Mustafa Fathy Abou El-Azm** and based on
[`mgce/modular-monolith-nodejs`](https://github.com/mgce/modular-monolith-nodejs).
Each module is strongly isolated so it can be developed independently and, later,
extracted into a microservice.

## Tooling

- **Monorepo manager:** [Rush](https://rushjs.io/) (`rush.json`) over pnpm.
- **Language/build:** TypeScript, compiled with `tsc` / `swc` via the shared
  `@travelhoop/toolchain` package.
- **Persistence:** PostgreSQL via [MikroORM](https://mikro-orm.io/) 4.
- **Messaging/cache:** Redis (async message broker between modules).
- **DI:** [Awilix](https://github.com/jeffijoe/awilix) container.
- **Tests:** Mocha + Chai (+ ts-mockito). Tests bootstrap MikroORM, so a running
  Postgres is required.

## Common commands

Run from the repository root (Rush must be installed: `npm i -g @microsoft/rush`):

```bash
rush install          # install dependencies for every package
rush build            # build all packages (respects the dependency graph)
rush build:watch      # incremental rebuild while developing
```

Infrastructure + app (from `src/app/travelhoop`):

```bash
docker-compose up -d                 # start Postgres (:5440) and Redis (:6379)
cp .env.dist .env                    # create local env file
npm run migration:up                 # apply database migrations
npm run start-dev                    # run the HTTP app (needs rush build:watch too)
npm test                             # run the mocha suite (needs Postgres)
```

Lint a package (from that package's directory):

```bash
npm run lint         # eslint
npm run lint:fix     # eslint --fix
```

## Architecture

- `src/app/travelhoop` — the composition root / HTTP application (`@travelhoop/app`).
- `src/app/scheduler` — the scheduler application.
- `src/modules/*` — business modules. `booking` is the rich domain and uses full
  DDD layering (`domain` / `application` / `infrastructure` / `api`). `couch`,
  `user` and `review` are simpler CRUD-style modules (`api` / `core`); keep that
  distinction deliberate — not every module needs aggregates and domain services.
- `src/shared/*` — cross-cutting building blocks: `kernel` (AggregateRoot, domain
  events), `abstract-core` (command/event dispatcher contracts) and
  `infrastructure` (MikroORM, Awilix container builder, Express middleware,
  messaging).
- `docs/adr` — Architectural Decision Records explaining why choices were made.

## Conventions

- **Commits:** Conventional Commits.
- **Formatting/linting:** ESLint (airbnb-typescript + Prettier). Double quotes,
  2-space indent, `printWidth` 120, `arrowParens: avoid`. Run `npm run lint`
  before committing.
- **Commands are transactional:** a command handler may perform several writes;
  they all commit or roll back together via `TransactionalCommandDispatcherDecorator`.
  Repositories use the request-scoped `RequestContext` EntityManager — do not
  create ad-hoc EM forks inside handlers.
- **Generated code:** MikroORM migrations under `src/app/travelhoop/src/migrations`
  are generated and excluded from linting; do not hand-format them.
- **Config:** copy `src/app/travelhoop/.env.dist` to `.env`; never commit real
  secrets (the committed values are local development defaults).
