from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import User
from marketpilot_api.repositories.portfolios import (
    create_portfolio_with_initial_deposit,
    list_portfolios_with_cash,
)
from marketpilot_api.schemas.portfolios import (
    PortfolioCreateRequest,
    PortfolioResponse,
)

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.post(
    "",
    response_model=PortfolioResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_portfolio(
    data: PortfolioCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> PortfolioResponse:
    portfolio = create_portfolio_with_initial_deposit(
        session,
        user_id=current_user.id,
        data=data,
    )
    return PortfolioResponse(
        id=portfolio.id,
        name=portfolio.name,
        base_currency=portfolio.base_currency,
        current_cash=data.initial_capital,
        created_at=portfolio.created_at,
        updated_at=portfolio.updated_at,
    )


@router.get("", response_model=list[PortfolioResponse])
def list_portfolios(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> list[PortfolioResponse]:
    return [
        PortfolioResponse(
            id=item.portfolio.id,
            name=item.portfolio.name,
            base_currency=item.portfolio.base_currency,
            current_cash=item.current_cash,
            created_at=item.portfolio.created_at,
            updated_at=item.portfolio.updated_at,
        )
        for item in list_portfolios_with_cash(
            session,
            user_id=current_user.id,
        )
    ]
