.PHONY: api-check venue venue-check web-check check

api-check:
	cd services/api && . .venv/bin/activate && ruff check . && ruff format --check . && mypy src && pytest -q

venue:
	cd packages/venue && . .venv/bin/activate && generate-venue ../../apps/web/public/venues/fleeva-arena/v1/layout.json

venue-check:
	cd packages/venue && . .venv/bin/activate && ruff check . && ruff format --check . && mypy src && pytest -q

web-check:
	cd apps/web && npx ng lint && npx ng test --watch=false && npx ng build

check: api-check venue-check web-check
