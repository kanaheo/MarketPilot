from marketpilot_api.db.base import Base
from marketpilot_api.models import Portfolio


def test_portfolio_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["portfolios"]

    assert Portfolio.__tablename__ == "portfolios"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "base_currency",
        "created_at",
        "id",
        "name",
        "updated_at",
        "user_id",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "users.id"
        for foreign_key in table.foreign_keys
    )
