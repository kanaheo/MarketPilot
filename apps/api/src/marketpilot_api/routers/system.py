from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError

from marketpilot_api.db.session import check_database_connection
from marketpilot_api.schemas.health import HealthResponse
from marketpilot_api.schemas.readiness import ReadinessResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="marketpilot-api")


@router.get("/readiness", response_model=ReadinessResponse)
def readiness() -> ReadinessResponse:
    try:
        check_database_connection()
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable",
        ) from error

    return ReadinessResponse(status="ready", database="available")
