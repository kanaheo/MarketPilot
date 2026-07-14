from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError


PASSWORD_HASH_ALGORITHM = "argon2id"
PASSWORD_HASH_PARAMETERS = "time_cost=3,memory_cost=65536,parallelism=4,hash_len=32,salt_len=16"

_password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    salt_len=16,
)


def hash_password(password: str) -> tuple[str, str, str]:
    return (
        _password_hasher.hash(password),
        PASSWORD_HASH_ALGORITHM,
        PASSWORD_HASH_PARAMETERS,
    )


def verify_password(
    password: str,
    *,
    password_hash: str,
    password_hash_algorithm: str,
    password_hash_parameters: str | None,
) -> bool:
    if password_hash_algorithm != PASSWORD_HASH_ALGORITHM:
        return False

    if password_hash_parameters != PASSWORD_HASH_PARAMETERS:
        return False

    try:
        return _password_hasher.verify(password_hash, password)
    except (InvalidHashError, VerificationError, VerifyMismatchError):
        return False
