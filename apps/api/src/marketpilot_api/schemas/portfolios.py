import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

SupportedCurrency = Literal["USD", "KRW", "JPY"]


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
