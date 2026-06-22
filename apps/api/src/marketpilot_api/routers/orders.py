import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import User
from marketpilot_api.repositories.orders import (
    OrderPortfolioNotFoundError,
    create_order,
    list_orders,
)
from marketpilot_api.schemas.orders import OrderCreateRequest, OrderResponse

router = APIRouter(
    prefix="/portfolios/{portfolio_id}/orders",
    tags=["orders"],
)


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_order(
    portfolio_id: uuid.UUID,
    data: OrderCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> OrderResponse:
    try:
        order = create_order(
            session,
            portfolio_id=portfolio_id,
            user_id=current_user.id,
            data=data,
        )
    except OrderPortfolioNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        ) from None

    return OrderResponse.model_validate(order)


@router.get("", response_model=list[OrderResponse])
def retrieve_orders(
    portfolio_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> list[OrderResponse]:
    try:
        return [
            OrderResponse.model_validate(order)
            for order in list_orders(
                session,
                portfolio_id=portfolio_id,
                user_id=current_user.id,
            )
        ]
    except OrderPortfolioNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        ) from None
