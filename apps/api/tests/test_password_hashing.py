from marketpilot_api.core.password_hashing import (
    PASSWORD_HASH_ALGORITHM,
    hash_password,
    verify_password,
)


def test_hash_password_returns_verifiable_scrypt_hash() -> None:
    password_hash, algorithm, parameters = hash_password("MarketPilot2026!")

    assert algorithm == PASSWORD_HASH_ALGORITHM
    assert "n=" in parameters
    assert verify_password(
        "MarketPilot2026!",
        password_hash=password_hash,
        password_hash_algorithm=algorithm,
        password_hash_parameters=parameters,
    )


def test_verify_password_rejects_wrong_password() -> None:
    password_hash, algorithm, parameters = hash_password("MarketPilot2026!")

    assert not verify_password(
        "WrongPassword2026!",
        password_hash=password_hash,
        password_hash_algorithm=algorithm,
        password_hash_parameters=parameters,
    )


def test_verify_password_rejects_unknown_algorithm() -> None:
    password_hash, _algorithm, parameters = hash_password("MarketPilot2026!")

    assert not verify_password(
        "MarketPilot2026!",
        password_hash=password_hash,
        password_hash_algorithm="plain",
        password_hash_parameters=parameters,
    )
