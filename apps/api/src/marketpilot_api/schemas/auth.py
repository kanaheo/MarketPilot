import uuid
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

AuthLocale = Literal["ko", "en", "ja"]


class UserSyncRequest(BaseModel):
    auth_provider: str = Field(min_length=1, max_length=32)
    auth_subject: str = Field(min_length=1, max_length=255)
    email: str | None = Field(default=None, max_length=320)
    display_name: str | None = Field(default=None, max_length=120)
    image_url: str | None = Field(default=None, max_length=2048)


class AuthenticatedUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    auth_provider: str
    auth_subject: str
    email: str | None
    display_name: str | None
    image_url: str | None


class PasswordSignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)
    display_name: str | None = Field(default=None, max_length=120)
    locale: AuthLocale = "ko"


class PasswordSignupResponse(BaseModel):
    user_id: uuid.UUID
    email: str
    email_verification_required: bool
    dev_email_verification_token: str | None = None


class PasswordVerifyRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class EmailVerificationConfirmRequest(BaseModel):
    token: str = Field(min_length=32, max_length=512)


class PasswordResetRequest(BaseModel):
    email: EmailStr
    locale: AuthLocale = "ko"


class PasswordResetCompleteRequest(BaseModel):
    token: str = Field(min_length=32, max_length=512)
    new_password: str = Field(min_length=1, max_length=128)


class AuthActionResponse(BaseModel):
    message: str
    dev_token: str | None = None
