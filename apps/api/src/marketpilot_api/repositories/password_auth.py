from datetime import datetime, timezone
import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from marketpilot_api.core.password_hashing import hash_password, verify_password
from marketpilot_api.models import User, UserPasswordCredential


class PasswordAuthDuplicateEmailError(Exception):
    pass


class PasswordAuthInvalidCredentialsError(Exception):
    pass


class PasswordAuthEmailNotVerifiedError(Exception):
    pass


def normalize_email(email: str) -> str:
    return email.strip().casefold()


def create_password_user(
    session: Session,
    *,
    email: str,
    password: str,
    display_name: str | None,
) -> tuple[User, UserPasswordCredential]:
    normalized_email = normalize_email(email)
    password_hash, hash_algorithm, hash_parameters = hash_password(password)
    now = datetime.now(timezone.utc)
    user = User(
        id=uuid.uuid4(),
        auth_provider="password",
        auth_subject=normalized_email,
        email=normalized_email,
        display_name=display_name,
        image_url=None,
    )
    credential = UserPasswordCredential(
        id=uuid.uuid4(),
        user_id=user.id,
        normalized_email=normalized_email,
        password_hash=password_hash,
        password_hash_algorithm=hash_algorithm,
        password_hash_parameters=hash_parameters,
        email_verified_at=None,
        failed_login_count=0,
        locked_until=None,
        password_changed_at=now,
    )

    try:
        session.add(user)
        session.add(credential)
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise PasswordAuthDuplicateEmailError from exc

    session.refresh(user)
    session.refresh(credential)
    return user, credential


def verify_password_user(
    session: Session,
    *,
    email: str,
    password: str,
) -> User:
    normalized_email = normalize_email(email)
    credential = session.scalar(
        select(UserPasswordCredential).where(
            UserPasswordCredential.normalized_email == normalized_email,
        )
    )

    if credential is None:
        raise PasswordAuthInvalidCredentialsError

    if credential.locked_until is not None:
        now = datetime.now(timezone.utc)
        locked_until = credential.locked_until
        if locked_until.tzinfo is None:
            locked_until = locked_until.replace(tzinfo=timezone.utc)
        if locked_until > now:
            raise PasswordAuthInvalidCredentialsError

    is_valid = verify_password(
        password,
        password_hash=credential.password_hash,
        password_hash_algorithm=credential.password_hash_algorithm,
        password_hash_parameters=credential.password_hash_parameters,
    )
    if not is_valid:
        credential.failed_login_count += 1
        session.commit()
        raise PasswordAuthInvalidCredentialsError

    if credential.email_verified_at is None:
        raise PasswordAuthEmailNotVerifiedError

    user = session.scalar(select(User).where(User.id == credential.user_id))
    if user is None:
        raise PasswordAuthInvalidCredentialsError

    credential.failed_login_count = 0
    session.commit()
    session.refresh(user)
    return user
