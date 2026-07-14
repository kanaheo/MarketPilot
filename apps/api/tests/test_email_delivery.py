from unittest.mock import MagicMock, patch

from marketpilot_api.core.config import Settings
from marketpilot_api.services.email_delivery import (
    EmailDeliveryError,
    send_email_verification,
    send_password_reset,
)


def test_disabled_email_provider_does_not_deliver() -> None:
    settings = Settings(_env_file=None)

    result = send_email_verification(
        settings=settings,
        to_email="developer@example.com",
        token="verification-token",
    )

    assert result.delivered is False


def test_smtp_email_verification_sends_message() -> None:
    settings = Settings(
        _env_file=None,
        email_provider="smtp",
        email_from="no-reply@example.com",
        auth_email_base_url="https://app.example.com/en",
        smtp_host="smtp.example.com",
        smtp_username="smtp-user",
        smtp_password="smtp-password",
    )
    smtp = MagicMock()

    with patch("marketpilot_api.services.email_delivery.smtplib.SMTP") as smtp_cls:
        smtp_cls.return_value.__enter__.return_value = smtp
        result = send_email_verification(
            settings=settings,
            to_email="developer@example.com",
            token="verification token",
        )

    assert result.delivered is True
    smtp.starttls.assert_called_once()
    smtp.login.assert_called_once_with("smtp-user", "smtp-password")
    sent_message = smtp.send_message.call_args.args[0]
    assert sent_message["From"] == "no-reply@example.com"
    assert sent_message["To"] == "developer@example.com"
    assert sent_message["Subject"] == "Verify your MarketPilot email"
    assert (
        "https://app.example.com/en/verify-email?token=verification+token"
        in sent_message.get_content()
    )


def test_smtp_password_reset_sends_reset_link_without_tls() -> None:
    settings = Settings(
        _env_file=None,
        email_provider="smtp",
        email_from="no-reply@example.com",
        auth_email_base_url="https://app.example.com/ko",
        smtp_host="smtp.example.com",
        smtp_use_tls=False,
    )
    smtp = MagicMock()

    with patch("marketpilot_api.services.email_delivery.smtplib.SMTP") as smtp_cls:
        smtp_cls.return_value.__enter__.return_value = smtp
        result = send_password_reset(
            settings=settings,
            to_email="developer@example.com",
            token="reset-token",
        )

    assert result.delivered is True
    smtp.starttls.assert_not_called()
    sent_message = smtp.send_message.call_args.args[0]
    assert sent_message["Subject"] == "Reset your MarketPilot password"
    assert (
        "https://app.example.com/ko/reset-password?token=reset-token"
        in sent_message.get_content()
    )


def test_smtp_provider_requires_sender_and_host() -> None:
    settings = Settings(_env_file=None, email_provider="smtp")

    try:
        send_password_reset(
            settings=settings,
            to_email="developer@example.com",
            token="reset-token",
        )
    except EmailDeliveryError as exc:
        assert "not configured" in str(exc)
    else:
        raise AssertionError("Expected EmailDeliveryError")
