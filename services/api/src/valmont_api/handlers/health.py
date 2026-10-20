import json
from typing import Any

from valmont_api import __version__


def handler(event: dict[str, Any], context: object) -> dict[str, Any]:
    """Liveness probe for API Gateway."""
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps({"status": "ok", "version": __version__}),
    }
