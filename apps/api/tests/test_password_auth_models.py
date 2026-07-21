from marketpilot_api.db.base import Base
from marketpilot_api.models import (
    UserAuthIdentity,
    UserAuthToken,
    UserPasswordCredential,
)


def test_user_password_credential_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["user_password_credentials"]

    assert UserPasswordCredential.__tablename__ == "user_password_credentials"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "created_at",
        "email_verified_at",
        "failed_login_count",
        "id",
        "locked_until",
        "normalized_email",
        "password_changed_at",
        "password_hash",
        "password_hash_algorithm",
        "password_hash_parameters",
        "updated_at",
        "user_id",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "users.id"
        for foreign_key in table.foreign_keys
    )
    assert any(
        constraint.name == "uq_user_password_credentials_user_id"
        for constraint in table.constraints
    )
    assert any(
        constraint.name == "uq_user_password_credentials_normalized_email"
        for constraint in table.constraints
    )


def test_user_auth_token_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["user_auth_tokens"]

    assert UserAuthToken.__tablename__ == "user_auth_tokens"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "created_at",
        "expires_at",
        "id",
        "purpose",
        "token_hash",
        "used_at",
        "user_id",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "users.id"
        for foreign_key in table.foreign_keys
    )
    assert any(
        constraint.name == "uq_user_auth_tokens_token_hash"
        for constraint in table.constraints
    )


def test_user_auth_identity_model_is_registered_in_metadata() -> None:
    table = Base.metadata.tables["user_auth_identities"]

    assert UserAuthIdentity.__tablename__ == "user_auth_identities"
    assert table.primary_key.columns.keys() == ["id"]
    assert {
        "auth_provider",
        "auth_subject",
        "created_at",
        "id",
        "updated_at",
        "user_id",
    } == set(table.columns.keys())
    assert any(
        foreign_key.target_fullname == "users.id"
        for foreign_key in table.foreign_keys
    )
    assert any(
        constraint.name == "uq_user_auth_identities_auth_identity"
        for constraint in table.constraints
    )
    assert any(
        constraint.name == "uq_user_auth_identities_user_provider"
        for constraint in table.constraints
    )
