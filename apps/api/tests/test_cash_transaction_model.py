from marketpilot_api.db.base import Base
from marketpilot_api.models import CashTransaction


def test_cash_transaction_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["cash_transactions"]

    assert CashTransaction.__tablename__ == "cash_transactions"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "amount",
        "created_at",
        "currency",
        "id",
        "note",
        "occurred_at",
        "portfolio_id",
        "transaction_type",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "portfolios.id"
        for foreign_key in table.foreign_keys
    )
    assert {
        "ck_cash_transactions_cash_transaction_positive_amount",
        "ck_cash_transactions_cash_transaction_type",
    }.issubset(
        {
            constraint.name
            for constraint in table.constraints
            if constraint.name is not None
        }
    )
