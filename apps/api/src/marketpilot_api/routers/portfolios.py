import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import User
from marketpilot_api.repositories.portfolios import (
    InsufficientCashError,
    PortfolioNotFoundError,
    create_cash_transaction,
    create_portfolio_with_initial_deposit,
    get_portfolio_detail,
    list_portfolios_with_cash,
)
from marketpilot_api.schemas.portfolios import (
    CashTransactionCreateRequest,
    CashTransactionResponse,
    PortfolioCreateRequest,
    PortfolioDetailResponse,
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


@router.get(
    "/{portfolio_id}",
    response_model=PortfolioDetailResponse,
)
def retrieve_portfolio(
    portfolio_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> PortfolioDetailResponse:
    detail = get_portfolio_detail(
        session,
        portfolio_id=portfolio_id,
        user_id=current_user.id,
    )
    if detail is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    return PortfolioDetailResponse(
        id=detail.portfolio.id,
        name=detail.portfolio.name,
        base_currency=detail.portfolio.base_currency,
        current_cash=detail.current_cash,
        net_contributions=detail.net_contributions,
        realized_profit_loss=detail.realized_profit_loss,
        created_at=detail.portfolio.created_at,
        updated_at=detail.portfolio.updated_at,
        recent_cash_transactions=detail.recent_cash_transactions,
        holdings=detail.holdings,
    )


@router.post(
    "/{portfolio_id}/cash-transactions",
    response_model=CashTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_cash_transaction(
    portfolio_id: uuid.UUID,
    data: CashTransactionCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> CashTransactionResponse:
    try:
        cash_transaction = create_cash_transaction(
            session,
            portfolio_id=portfolio_id,
            user_id=current_user.id,
            data=data,
        )
    except PortfolioNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        ) from None
    except InsufficientCashError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient cash balance",
        ) from None

    return CashTransactionResponse.model_validate(cash_transaction)
