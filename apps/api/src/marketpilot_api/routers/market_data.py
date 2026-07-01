from typing import Annotated

from fastapi import APIRouter, Query

from marketpilot_api.repositories.price_quotes import list_fixture_current_prices
from marketpilot_api.schemas.market_data import MarketQuoteResponse
from marketpilot_api.schemas.portfolios import SupportedCurrency

router = APIRouter(prefix="/market-data", tags=["market-data"])


@router.get("/quotes", response_model=list[MarketQuoteResponse])
def list_market_quotes(
    currency: SupportedCurrency | None = None,
    symbols: Annotated[list[str] | None, Query()] = None,
) -> list[MarketQuoteResponse]:
    return [
        MarketQuoteResponse(
            symbol=symbol,
            currency=quote_currency,
            current_price=current_price,
            source="fixture",
        )
        for symbol, quote_currency, current_price in list_fixture_current_prices(
            currency=currency,
            symbols=symbols,
        )
    ]
