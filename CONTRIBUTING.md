# Contributing

## Workflow
1. Branch from `main`: `feat/<scope>-<short-name>`, `fix/...`, `chore/...`, `docs/...`
2. Small, focused commits using [Conventional Commits](https://www.conventionalcommits.org):
   `feat(api): add seat hold endpoint`, `fix(web): ...`, `ci: ...`, `docs: ...`
3. Open a PR into `main`. CI must be green. Squash-merge.
4. `main` is always deployable.

## Scopes
`api`, `web`, `scanner`, `admin`, `infra`, `venue`, `shared`, `ci`, `docs`

## Definition of done
- Tests for new behaviour (unit; integration where it touches DynamoDB)
- Lint, format and type checks pass
- Docs / ADR updated if a design decision changed
