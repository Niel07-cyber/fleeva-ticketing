.PHONY: api-check web-check check

api-check:
	cd services/api && . .venv/bin/activate && ruff check . && ruff format --check . && mypy src && pytest -q

web-check:
	cd apps/web && npx ng lint && npx ng test --watch=false && npx ng build

check: api-check web-check
