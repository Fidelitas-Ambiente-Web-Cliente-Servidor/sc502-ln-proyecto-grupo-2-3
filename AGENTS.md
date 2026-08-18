# AGENTS — AI coding agent instructions

Purpose: provide brief, actionable guidance so an AI agent can become productive quickly in this repository.

Principles
- Link, don't embed: point to existing docs (README, SQL schema, compose file) instead of copying them.
- Minimal and actionable: include only details an agent cannot easily infer.

Quick pointers
- Project overview: see [README.md](README.md) for high-level status and structure.
- Run/build: the repository includes a `docker-compose.yml` at the repo root. When Docker is used, the common command is `docker compose -f docker-compose.yml up -d --build`.
- Database: schema and seed are in [database/schema.sql](database/schema.sql) and [database/seed.sql](database/seed.sql).

Key locations
- Frontend (served statically): [public/](public/)
- API endpoints and PHP stubs: [api/](api/)
- Docker PHP config: [docker/php/](docker/php/)

Agent rules and expectations
- Preserve existing SQL and seed files; do not run destructive migrations without explicit consent.
- When making changes that affect runtime (Docker, DB, PHP), prefer small, easily reversible commits and describe how to run the app locally.
- Link added/modified files in PR descriptions; include commands used to verify changes.

Suggested next customizations
- Create a small task-specific skill for running the local Docker + DB setup and checks.

Maintainers: update this file when repository structure or run instructions change.
