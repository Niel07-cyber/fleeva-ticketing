import json

from valmont_api.handlers.health import handler


def test_health_returns_ok() -> None:
    response = handler({}, object())

    assert response["statusCode"] == 200
    assert json.loads(response["body"])["status"] == "ok"


def test_health_is_never_cached() -> None:
    response = handler({}, object())

    assert response["headers"]["Cache-Control"] == "no-store"
