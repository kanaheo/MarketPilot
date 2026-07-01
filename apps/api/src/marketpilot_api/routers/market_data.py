from typing import Annotated

from fastapi import APIRouter, Query

from marketpilot_api.repositories.price_quotes import (
    list_market_quotes as list_provider_market_quotes,
)
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
            symbol=quote.symbol,
            currency=quote.currency,
            current_price=quote.current_price,
            source=quote.source,
        )
        for quote in list_provider_market_quotes(
            currency=currency,
            symbols=symbols,
        )
    ]
