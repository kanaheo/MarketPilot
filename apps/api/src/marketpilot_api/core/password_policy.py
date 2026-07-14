from dataclasses import dataclass
import string


MIN_PASSWORD_LENGTH = 12
MAX_PASSWORD_LENGTH = 128

COMMON_PASSWORDS = {
    "123456789012",
    "password123!",
    "password1234!",
    "qwerty12345!",
    "admin123456!",
    "marketpilot1!",
}


@dataclass(frozen=True)
class PasswordPolicyResult:
    is_valid: bool
    errors: tuple[str, ...]


def validate_password_policy(password: str) -> PasswordPolicyResult:
    errors: list[str] = []

    if len(password) < MIN_PASSWORD_LENGTH:
        errors.append("password_too_short")

    if len(password) > MAX_PASSWORD_LENGTH:
        errors.append("password_too_long")

    if not any(character in string.ascii_lowercase for character in password):
        errors.append("missing_lowercase")

    if not any(character in string.ascii_uppercase for character in password):
        errors.append("missing_uppercase")

    if not any(character in string.digits for character in password):
        errors.append("missing_number")

    if not any(character in string.punctuation for character in password):
        errors.append("missing_special_character")

    if password.casefold() in COMMON_PASSWORDS:
        errors.append("common_password")

    return PasswordPolicyResult(
        is_valid=len(errors) == 0,
        errors=tuple(errors),
    )
