import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from marketpilot_api.models import User
from marketpilot_api.schemas.auth import UserSyncRequest


def get_user_by_id(session: Session, user_id: uuid.UUID) -> User | None:
    return session.scalar(select(User).where(User.id == user_id))


def upsert_user(session: Session, data: UserSyncRequest) -> User:
    user = session.scalar(
        select(User).where(
            User.auth_provider == data.auth_provider,
            User.auth_subject == data.auth_subject,
        )
    )

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
    else:
        user.email = data.email
        user.display_name = data.display_name
        user.image_url = data.image_url

    session.commit()
    session.refresh(user)
    return user
