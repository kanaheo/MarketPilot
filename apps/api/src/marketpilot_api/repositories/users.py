import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import User, UserAuthIdentity
from marketpilot_api.schemas.auth import UserSyncRequest

EMAIL_LINKABLE_AUTH_PROVIDERS = frozenset({"google"})


class UserSyncEmailConflictError(Exception):
    pass


def get_user_by_id(session: Session, user_id: uuid.UUID) -> User | None:
    return session.scalar(select(User).where(User.id == user_id))


def upsert_user(session: Session, data: UserSyncRequest) -> User:
    identity = session.scalar(
        select(UserAuthIdentity).where(
            UserAuthIdentity.auth_provider == data.auth_provider,
            UserAuthIdentity.auth_subject == data.auth_subject,
        )
    )
    user = (
        None
        if identity is None
        else session.scalar(select(User).where(User.id == identity.user_id))
    )

    if user is None:
        user = _get_linkable_user_by_email(session, data)
        if user is None:
            user = User(
                id=uuid.uuid4(),
                auth_provider=data.auth_provider,
                auth_subject=data.auth_subject,
                email=data.email,
                display_name=data.display_name,
                image_url=data.image_url,
            )
            session.add(user)
        session.add(
            UserAuthIdentity(
                id=uuid.uuid4(),
                user_id=user.id,
                auth_provider=data.auth_provider,
                auth_subject=data.auth_subject,
            )
        )

    user.email = data.email
    user.display_name = data.display_name
    user.image_url = data.image_url

    session.commit()
    session.refresh(user)
    return user


def _get_linkable_user_by_email(
    session: Session,
    data: UserSyncRequest,
) -> User | None:
    if data.email is None:
        return None

    existing_email_user = session.scalar(
        select(User).where(func.lower(User.email) == _normalize_email(data.email))
    )
    if existing_email_user is None:
        return None

    if data.auth_provider not in EMAIL_LINKABLE_AUTH_PROVIDERS:
        raise UserSyncEmailConflictError

    existing_provider_identity = session.scalar(
        select(UserAuthIdentity).where(
            UserAuthIdentity.user_id == existing_email_user.id,
            UserAuthIdentity.auth_provider == data.auth_provider,
        )
    )
    if existing_provider_identity is not None:
        raise UserSyncEmailConflictError

    return existing_email_user


def _normalize_email(email: str) -> str:
    return email.strip().casefold()
