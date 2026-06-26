from marketpilot_api.db.base import Base
from marketpilot_api.models import OrderExecution


def test_order_execution_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["order_executions"]

    assert OrderExecution.__tablename__ == "order_executions"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "created_at",
        "currency",
        "executed_at",
        "gross_amount",
        "id",
        "order_id",
        "portfolio_id",
        "price",
        "quantity",
        "side",
        "symbol",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "orders.id"
        for foreign_key in table.foreign_keys
    )
    assert any(
        foreign_key.target_fullname == "portfolios.id"
        for foreign_key in table.foreign_keys
    )
