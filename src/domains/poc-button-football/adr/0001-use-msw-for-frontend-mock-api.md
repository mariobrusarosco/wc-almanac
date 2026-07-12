# ADR 0001: Use MSW for the Frontend Mock API

## Status

Accepted

## Context

The backend API is not ready yet, but the frontend needs to start moving away from direct JSON imports and toward API-shaped data access.

The project has generated local data in a database-like shape:

- `src/domains/poc-button-football/data/db/`: table-like JSON files that mimic future database tables, one JSON file per table.

The frontend should be able to fetch data through stable endpoint contracts now, then later point those same contracts at the real backend with minimal UI churn.

We need a mock API approach that:

- works in the browser during local development,
- keeps request/response contracts visible,
- can read from the generated JSON data,
- does not require a temporary custom backend server,
- can be removed cleanly when the real backend is available.

## Decision

Use MSW to provide a temporary frontend mock API.

The frontend will call API endpoints through normal `fetch` requests. During local development, MSW will intercept those requests in the browser and return responses from the generated JSON data.

Initial mock endpoints should be shaped around product/API concepts, not file paths. For example:

```txt
GET /api/world-cups
GET /api/world-cups/:year
GET /api/world-cups/:year/teams
GET /api/world-cups/:year/teams/:teamCode
```

Implemented endpoints:

```txt
GET /api/world-cups/:year
GET /api/world-cups/:year/teams/:teamCode
```

Mock handlers read from:

```txt
src/domains/poc-button-football/data/db/*.json
```

The mock functions are responsible for joining those table files into endpoint responses, mimicking backend query/assembly behavior. The frontend should not import these JSON files directly from screen components once an endpoint exists. UI code should depend on API-facing functions instead.

## Intended Shape

The mock layer should have three responsibilities:

```txt
generated JSON tables -> mock handlers/data joiners -> frontend API client -> screens
```

Suggested organization:

```txt
src/domains/poc-button-football/api/
- client.ts
- types.ts

src/domains/poc-button-football/mocks/
- browser.ts
- handlers.ts
- data.ts
```

The `api` folder represents the future backend contract. The `mocks` folder is temporary and exists only to fulfill that contract locally.

## Consequences

Positive:

- Frontend screens start using realistic request boundaries before the backend exists.
- Mock behavior is close to production fetch behavior because requests still go through `fetch`.
- Mock endpoints document the backend contract early.
- The generated JSON tables are the single mock data source.
- The mock can be removed by deleting MSW setup and pointing the API client to the real backend.

Tradeoffs:

- Adds a frontend-only development dependency.
- Requires keeping mock handlers aligned with the future backend contract.
- Mock handlers need a little more assembly code because they mimic backend joins instead of returning prebuilt frontend bundles.

## Alternatives Considered

### Direct JSON Imports

The current approach is simple, but it couples components to local file structure and does not exercise API boundaries.

### Custom Local Express/Fastify Mock Server

This would make the API boundary explicit, but adds another server process and more setup than needed for the current POC.

### Hardcoded In-Memory Mock Functions

This would be quick, but it would not exercise browser fetch behavior and would be easier to accidentally keep inside UI components.

## Removal Plan

When the backend is ready:

1. Keep the frontend API client method names and response types.
2. Replace MSW-backed local responses with real backend URLs.
3. Keep MSW only for tests or story/dev scenarios if still valuable.
4. Delete POC-only handlers once equivalent backend endpoints exist.

## Open Questions

- Which additional backend-style endpoints should be mocked next?
- Should the first API client expose only the current route need, `getWorldCupTeam(year, teamCode)`, or start with broader endpoints?
- Should MSW run in development only, or also support frontend tests later?
