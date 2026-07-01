import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

SupportedCurrency = Literal["USD", "KRW", "JPY"]
UserCashTransactionType = Literal["DEPOSIT", "WITHDRAWAL"]


class PortfolioCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    base_currency: SupportedCurrency
    initial_capital: Decimal = Field(
        gt=0,
        max_digits=20,
        decimal_places=4,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Portfolio name must not be blank")
        return stripped_value


class PortfolioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    base_currency: SupportedCurrency
    current_cash: Decimal
    created_at: datetime
    updated_at: datetime


class CashTransactionCreateRequest(BaseModel):
    transaction_type: UserCashTransactionType
    amount: Decimal = Field(
        gt=0,
        max_digits=20,
        decimal_places=4,
    )
    occurred_at: datetime
    note: str | None = Field(default=None, max_length=500)

    @field_validator("note")
    @classmethod
    def normalize_note(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped_value = value.strip()
        return stripped_value or None

    @field_validator("occurred_at")
    @classmethod
    def validate_occurred_at(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("Occurred at must include a timezone")
        return value


class CashTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    transaction_type: str
    amount: Decimal
    currency: SupportedCurrency
    occurred_at: datetime
    note: str | None
    created_at: datetime


class PortfolioHoldingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    symbol: str
    quantity: Decimal
    average_price: Decimal
    current_price: Decimal
    market_value: Decimal
    unrealized_profit_loss: Decimal
    return_rate: Decimal
    currency: SupportedCurrency


class PortfolioDetailResponse(PortfolioResponse):
    invested_value: Decimal
    net_contributions: Decimal
    realized_profit_loss: Decimal
    total_profit_loss: Decimal
    total_return_rate: Decimal
    total_value: Decimal
    unrealized_profit_loss: Decimal
    recent_cash_transactions: list[CashTransactionResponse]
    holdings: list[PortfolioHoldingResponse] = Field(default_factory=list)
    orders: list[object] = Field(default_factory=list)
