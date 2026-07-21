import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import User, UserAuthIdentity
from marketpilot_api.schemas.auth import UserSyncRequest


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
        if data.email is not None:
            existing_email_user = session.scalar(
                select(User).where(
                    func.lower(User.email) == _normalize_email(data.email)
                )
            )
            if existing_email_user is not None:
                raise UserSyncEmailConflictError

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
    else:
        user.email = data.email
        user.display_name = data.display_name
        user.image_url = data.image_url

    session.commit()
    session.refresh(user)
    return user


def _normalize_email(email: str) -> str:
    return email.strip().casefold()
