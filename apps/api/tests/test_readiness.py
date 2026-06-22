from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from marketpilot_api.main import app

client = TestClient(app)


def test_readiness_returns_ready_when_database_is_available(
    monkeypatch,
) -> None:
    monkeypatch.setattr(
        "marketpilot_api.routers.system.check_database_connection",
        lambda: None,
    )

    response = client.get("/readiness")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "database": "available",
    }


def test_readiness_returns_503_when_database_is_unavailable(
    monkeypatch,
) -> None:
    def raise_database_error() -> None:
        raise OperationalError("SELECT 1", {}, Exception("offline"))

    monkeypatch.setattr(
        "marketpilot_api.routers.system.check_database_connection",
        raise_database_error,
    )

    response = client.get("/readiness")

    assert response.status_code == 503
    assert response.json() == {"detail": "Database is unavailable"}
