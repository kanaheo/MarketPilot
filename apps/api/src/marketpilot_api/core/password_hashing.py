import base64
import hashlib
import hmac
import secrets


PASSWORD_HASH_ALGORITHM = "scrypt"
SCRYPT_N = 2**14
SCRYPT_R = 8
SCRYPT_P = 1
SCRYPT_DKLEN = 64
SALT_BYTES = 16


def hash_password(password: str) -> tuple[str, str, str]:
    salt = secrets.token_bytes(SALT_BYTES)
    password_hash = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=SCRYPT_N,
        r=SCRYPT_R,
        p=SCRYPT_P,
        dklen=SCRYPT_DKLEN,
    )
    parameters = f"n={SCRYPT_N},r={SCRYPT_R},p={SCRYPT_P},dklen={SCRYPT_DKLEN}"
    encoded_salt = base64.urlsafe_b64encode(salt).decode("ascii")
    encoded_hash = base64.urlsafe_b64encode(password_hash).decode("ascii")
    stored_hash = f"{encoded_salt}.{encoded_hash}"
    return stored_hash, PASSWORD_HASH_ALGORITHM, parameters


def verify_password(
    password: str,
    *,
    password_hash: str,
    password_hash_algorithm: str,
    password_hash_parameters: str | None,
) -> bool:
    if password_hash_algorithm != PASSWORD_HASH_ALGORITHM:
        return False

    if password_hash_parameters is None:
        return False

    try:
        salt_text, expected_hash_text = password_hash.split(".", maxsplit=1)
        parameters = _parse_scrypt_parameters(password_hash_parameters)
        salt = base64.urlsafe_b64decode(salt_text.encode("ascii"))
        expected_hash = base64.urlsafe_b64decode(expected_hash_text.encode("ascii"))
    except (KeyError, ValueError):
        return False

    actual_hash = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=parameters["n"],
        r=parameters["r"],
        p=parameters["p"],
        dklen=parameters["dklen"],
    )
    return hmac.compare_digest(actual_hash, expected_hash)


def _parse_scrypt_parameters(value: str) -> dict[str, int]:
    parameters: dict[str, int] = {}
    for pair in value.split(","):
        key, raw_number = pair.split("=", maxsplit=1)
        parameters[key] = int(raw_number)

    for required_key in ("n", "r", "p", "dklen"):
        if required_key not in parameters:
            raise KeyError(required_key)

    return parameters
