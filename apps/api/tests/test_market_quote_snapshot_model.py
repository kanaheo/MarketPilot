from marketpilot_api.db.base import Base
from marketpilot_api.models import MarketQuoteSnapshot


def test_market_quote_snapshot_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["market_quote_snapshots"]

    assert MarketQuoteSnapshot.__tablename__ == "market_quote_snapshots"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "collected_at",
        "created_at",
        "currency",
        "current_price",
        "id",
        "source",
        "symbol",
    } == set(table.columns.keys())
