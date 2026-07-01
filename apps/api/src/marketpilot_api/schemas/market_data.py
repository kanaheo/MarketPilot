from decimal import Decimal

from pydantic import BaseModel

from marketpilot_api.schemas.portfolios import SupportedCurrency


class MarketQuoteResponse(BaseModel):
    symbol: str
    currency: SupportedCurrency
    current_price: Decimal
    source: str


class FxRateResponse(BaseModel):
    base_currency: SupportedCurrency
    quote_currency: SupportedCurrency
    rate: Decimal
    source: str
