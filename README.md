# AS Valmont Ticketing

Serverless football ticketing platform on AWS (fictional club). Angular frontend, Python Lambda backend, DynamoDB, Terraform, GitHub Actions.

> Work in progress. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and [docs/decisions](docs/decisions) for ADRs.

## Layout
| Path | Purpose |
|---|---|
| `apps/web` | Angular app: public site, fan account |
| `services/api` | Python 3.13 Lambda handlers |
| `infra` | Terraform |
| `packages/` | Venue generator, API contracts |
| `scripts/` | Seeding and load tests |

## Local development
```bash
make check        # lint + typecheck + tests for api and web
```
Per-project instructions: [services/api](services/api/README.md), [apps/web](apps/web/README.md).
