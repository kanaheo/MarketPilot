import re
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from marketpilot_api.schemas.portfolios import SupportedCurrency

OrderSide = Literal["BUY", "SELL"]
OrderType = Literal["MARKET", "LIMIT"]
OrderStatus = Literal["PENDING", "FILLED", "REJECTED", "CANCELLED"]


class OrderCreateRequest(BaseModel):
    symbol: str = Field(min_length=1, max_length=32)
    side: OrderSide
    order_type: OrderType
    quantity: Decimal = Field(
        gt=0,
        max_digits=20,
        decimal_places=2,
    )
    limit_price: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=20,
        decimal_places=4,
    )
    decision_evidence: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def validate_order(self) -> "OrderCreateRequest":
        self.symbol = self.symbol.strip().upper()
        if not self.symbol:
            raise ValueError("Symbol must not be blank")
        if re.fullmatch(r"[A-Z0-9][A-Z0-9.-]{0,31}", self.symbol) is None:
            raise ValueError("Symbol contains unsupported characters")

        if self.order_type == "MARKET" and self.limit_price is not None:
            raise ValueError("Market orders must not include a limit price")
        if self.order_type == "LIMIT" and self.limit_price is None:
            raise ValueError("Limit orders require a limit price")

        if self.decision_evidence is not None:
            evidence = self.decision_evidence.strip()
            self.decision_evidence = evidence or None

        return self


class OrderExecuteRequest(BaseModel):
    price: Decimal = Field(
        gt=0,
        max_digits=20,
        decimal_places=4,
    )
    executed_at: datetime | None = None

    @model_validator(mode="after")
    def validate_execution(self) -> "OrderExecuteRequest":
        if self.executed_at is None:
            self.executed_at = datetime.now(timezone.utc)
            return self

        if (
            self.executed_at.tzinfo is None
            or self.executed_at.utcoffset() is None
        ):
            raise ValueError("Executed at must include a timezone")

        return self


class OrderUpdateRequest(BaseModel):
    quantity: Decimal = Field(
        gt=0,
        max_digits=20,
        decimal_places=2,
    )


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    portfolio_id: uuid.UUID
    symbol: str
    side: OrderSide
    order_type: OrderType
    quantity: Decimal
    limit_price: Decimal | None
    currency: SupportedCurrency
    status: OrderStatus
    strategy_version: str
    decision_evidence: str
    created_at: datetime
    updated_at: datetime
