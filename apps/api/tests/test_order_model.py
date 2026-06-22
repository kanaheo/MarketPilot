from marketpilot_api.db.base import Base
from marketpilot_api.models import Order


def test_order_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["orders"]

    assert Order.__tablename__ == "orders"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "created_at",
        "currency",
        "decision_evidence",
        "id",
        "limit_price",
        "order_type",
        "portfolio_id",
        "quantity",
        "side",
        "status",
        "strategy_version",
        "symbol",
        "updated_at",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "portfolios.id"
        for foreign_key in table.foreign_keys
    )
    assert {
        "ck_orders_order_limit_price_matches_type",
        "ck_orders_order_positive_limit_price",
        "ck_orders_order_positive_quantity",
        "ck_orders_order_side",
        "ck_orders_order_status",
        "ck_orders_order_type",
    }.issubset(
        {
            constraint.name
            for constraint in table.constraints
            if constraint.name is not None
        }
    )
