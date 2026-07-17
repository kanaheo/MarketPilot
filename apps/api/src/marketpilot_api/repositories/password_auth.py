from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import hashlib
import secrets
import uuid

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from marketpilot_api.core.password_hashing import hash_password, verify_password
from marketpilot_api.models import User, UserAuthToken, UserPasswordCredential

EMAIL_VERIFICATION_PURPOSE = "email_verification"
PASSWORD_RESET_PURPOSE = "password_reset"
EMAIL_VERIFICATION_TOKEN_TTL_HOURS = 24
PASSWORD_RESET_TOKEN_TTL_MINUTES = 30


class PasswordAuthDuplicateEmailError(Exception):
    pass


class PasswordAuthInvalidCredentialsError(Exception):
    pass


class PasswordAuthEmailNotVerifiedError(Exception):
    pass


class PasswordAuthInvalidTokenError(Exception):
    pass


def normalize_email(email: str) -> str:
    return email.strip().casefold()


def create_password_user(
    session: Session,
    *,
    email: str,
    password: str,
    display_name: str | None,
) -> tuple[User, UserPasswordCredential, str]:
    normalized_email = normalize_email(email)
    existing_user = session.scalar(
        select(User).where(func.lower(User.email) == normalized_email)
    )
    if existing_user is not None:
        raise PasswordAuthDuplicateEmailError

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
    verification_token = _create_auth_token(
        user_id=user.id,
        purpose=EMAIL_VERIFICATION_PURPOSE,
        expires_at=now + timedelta(hours=EMAIL_VERIFICATION_TOKEN_TTL_HOURS),
    )

    try:
        session.add(user)
        session.add(credential)
        session.add(verification_token.record)
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise PasswordAuthDuplicateEmailError from exc

    session.refresh(user)
    session.refresh(credential)
    return user, credential, verification_token.raw_token


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


def confirm_email_verification_token(session: Session, *, token: str) -> None:
    auth_token = _get_valid_auth_token(
        session,
        token=token,
        purpose=EMAIL_VERIFICATION_PURPOSE,
    )
    credential = session.scalar(
        select(UserPasswordCredential).where(
            UserPasswordCredential.user_id == auth_token.user_id,
        )
    )
    if credential is None:
        raise PasswordAuthInvalidTokenError

    now = datetime.now(timezone.utc)
    credential.email_verified_at = now
    auth_token.used_at = now
    session.commit()


def request_password_reset_token(session: Session, *, email: str) -> str | None:
    normalized_email = normalize_email(email)
    credential = session.scalar(
        select(UserPasswordCredential).where(
            UserPasswordCredential.normalized_email == normalized_email,
        )
    )
    if credential is None:
        return None

    now = datetime.now(timezone.utc)
    reset_token = _create_auth_token(
        user_id=credential.user_id,
        purpose=PASSWORD_RESET_PURPOSE,
        expires_at=now + timedelta(minutes=PASSWORD_RESET_TOKEN_TTL_MINUTES),
    )
    session.add(reset_token.record)
    session.commit()
    return reset_token.raw_token


def complete_password_reset(
    session: Session,
    *,
    token: str,
    new_password: str,
) -> None:
    auth_token = _get_valid_auth_token(
        session,
        token=token,
        purpose=PASSWORD_RESET_PURPOSE,
    )
    credential = session.scalar(
        select(UserPasswordCredential).where(
            UserPasswordCredential.user_id == auth_token.user_id,
        )
    )
    if credential is None:
        raise PasswordAuthInvalidTokenError

    password_hash, hash_algorithm, hash_parameters = hash_password(new_password)
    now = datetime.now(timezone.utc)
    credential.password_hash = password_hash
    credential.password_hash_algorithm = hash_algorithm
    credential.password_hash_parameters = hash_parameters
    credential.failed_login_count = 0
    credential.locked_until = None
    credential.password_changed_at = now
    auth_token.used_at = now
    session.commit()


@dataclass(frozen=True)
class _CreatedAuthToken:
    raw_token: str
    record: UserAuthToken


def _create_auth_token(
    *,
    user_id: uuid.UUID,
    purpose: str,
    expires_at: datetime,
) -> _CreatedAuthToken:
    raw_token = secrets.token_urlsafe(48)
    return _CreatedAuthToken(
        raw_token=raw_token,
        record=UserAuthToken(
            id=uuid.uuid4(),
            user_id=user_id,
            purpose=purpose,
            token_hash=_hash_token(raw_token),
            expires_at=expires_at,
            used_at=None,
        ),
    )


def _get_valid_auth_token(
    session: Session,
    *,
    token: str,
    purpose: str,
) -> UserAuthToken:
    auth_token = session.scalar(
        select(UserAuthToken).where(
            UserAuthToken.token_hash == _hash_token(token),
            UserAuthToken.purpose == purpose,
        )
    )
    if auth_token is None or auth_token.used_at is not None:
        raise PasswordAuthInvalidTokenError

    expires_at = auth_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc):
        raise PasswordAuthInvalidTokenError

    return auth_token


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
