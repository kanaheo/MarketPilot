from marketpilot_api.db.base import Base
from marketpilot_api.models import User


def test_user_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["users"]

    assert User.__tablename__ == "users"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "auth_provider",
        "auth_subject",
        "created_at",
        "email",
        "id",
        "updated_at",
    }.issubset(table.columns.keys())
    assert any(
        constraint.name == "uq_users_auth_identity"
        for constraint in table.constraints
    )
