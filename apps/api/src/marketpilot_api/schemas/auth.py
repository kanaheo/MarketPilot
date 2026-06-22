import uuid

from pydantic import BaseModel, ConfigDict, Field


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
