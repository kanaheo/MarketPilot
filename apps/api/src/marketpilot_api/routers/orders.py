import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import User
from marketpilot_api.repositories.orders import (
    OrderExecutionPriceError,
    OrderInsufficientCashError,
    OrderInsufficientPositionError,
    OrderNotDeletableError,
    OrderNotFoundError,
    OrderNotPendingError,
    OrderPortfolioNotFoundError,
    cancel_order,
    create_order,
    delete_order,
    execute_order,
    list_orders,
    update_order,
)
from marketpilot_api.schemas.orders import (
    OrderCreateRequest,
    OrderExecuteRequest,
    OrderResponse,
    OrderUpdateRequest,
)

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
    except OrderInsufficientCashError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient cash balance",
        ) from None
    except OrderInsufficientPositionError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient position quantity",
        ) from None

    return OrderResponse.model_validate(order)


@router.patch(
    "/{order_id}/execute",
    response_model=OrderResponse,
)
def execute_pending_order(
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    data: OrderExecuteRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> OrderResponse:
    try:
        order = execute_order(
            session,
            portfolio_id=portfolio_id,
            order_id=order_id,
            user_id=current_user.id,
            data=data,
        )
    except (OrderPortfolioNotFoundError, OrderNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        ) from None
    except OrderNotPendingError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending orders can be executed",
        ) from None
    except OrderInsufficientCashError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient cash balance",
        ) from None
    except OrderInsufficientPositionError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient position quantity",
        ) from None
    except OrderExecutionPriceError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Execution price does not satisfy the limit order",
        ) from None

    return OrderResponse.model_validate(order)


@router.patch(
    "/{order_id}",
    response_model=OrderResponse,
)
def update_pending_order(
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    data: OrderUpdateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> OrderResponse:
    try:
        order = update_order(
            session,
            portfolio_id=portfolio_id,
            order_id=order_id,
            user_id=current_user.id,
            data=data,
        )
    except (OrderPortfolioNotFoundError, OrderNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        ) from None
    except OrderNotPendingError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending orders can be updated",
        ) from None
    except OrderInsufficientCashError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient cash balance",
        ) from None
    except OrderInsufficientPositionError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient position quantity",
        ) from None

    return OrderResponse.model_validate(order)


@router.patch(
    "/{order_id}/cancel",
    response_model=OrderResponse,
)
def cancel_pending_order(
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> OrderResponse:
    try:
        order = cancel_order(
            session,
            portfolio_id=portfolio_id,
            order_id=order_id,
            user_id=current_user.id,
        )
    except (OrderPortfolioNotFoundError, OrderNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        ) from None
    except OrderNotPendingError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending orders can be cancelled",
        ) from None

    return OrderResponse.model_validate(order)


@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_unfilled_order(
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> None:
    try:
        delete_order(
            session,
            portfolio_id=portfolio_id,
            order_id=order_id,
            user_id=current_user.id,
        )
    except (OrderPortfolioNotFoundError, OrderNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        ) from None
    except OrderNotDeletableError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Filled orders cannot be deleted",
        ) from None


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
