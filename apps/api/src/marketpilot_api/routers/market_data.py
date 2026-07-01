from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status

from marketpilot_api.repositories.fx_rates import get_fx_rate
from marketpilot_api.repositories.price_quotes import (
    list_market_quotes as list_provider_market_quotes,
)
from marketpilot_api.schemas.market_data import (
    FxRateResponse,
    MarketQuoteResponse,
)
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


@router.get("/fx-rates", response_model=FxRateResponse)
def retrieve_fx_rate(
    base_currency: SupportedCurrency,
    quote_currency: SupportedCurrency,
) -> FxRateResponse:
    fx_rate = get_fx_rate(
        base_currency=base_currency,
        quote_currency=quote_currency,
    )

    if fx_rate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FX rate not found",
        )

    return FxRateResponse(
        base_currency=fx_rate.base_currency,
        quote_currency=fx_rate.quote_currency,
        rate=fx_rate.rate,
        source=fx_rate.source,
    )
