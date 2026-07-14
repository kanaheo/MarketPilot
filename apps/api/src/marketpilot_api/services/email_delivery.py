from dataclasses import dataclass
from email.message import EmailMessage
import smtplib
from urllib.parse import urlencode

from marketpilot_api.core.config import Settings


class EmailDeliveryError(Exception):
    pass


@dataclass(frozen=True)
class EmailDeliveryResult:
    delivered: bool


def send_email_verification(
    *,
    settings: Settings,
    to_email: str,
    token: str,
) -> EmailDeliveryResult:
    verification_url = _build_auth_url(
        settings=settings,
        path="/verify-email",
        token=token,
    )
    return _send_auth_email(
        settings=settings,
        to_email=to_email,
        subject="Verify your MarketPilot email",
        body=(
            "Verify your MarketPilot email address:\n\n"
            f"{verification_url}\n\n"
            "This link expires in 24 hours."
        ),
    )


def send_password_reset(
    *,
    settings: Settings,
    to_email: str,
    token: str,
) -> EmailDeliveryResult:
    reset_url = _build_auth_url(
        settings=settings,
        path="/reset-password",
        token=token,
    )
    return _send_auth_email(
        settings=settings,
        to_email=to_email,
        subject="Reset your MarketPilot password",
        body=(
            "Reset your MarketPilot password:\n\n"
            f"{reset_url}\n\n"
            "This link expires in 30 minutes. If you did not request this, "
            "you can ignore this email."
        ),
    )


def _send_auth_email(
    *,
    settings: Settings,
    to_email: str,
    subject: str,
    body: str,
) -> EmailDeliveryResult:
    if settings.email_provider == "disabled":
        return EmailDeliveryResult(delivered=False)

    if settings.email_provider == "smtp":
        _send_smtp_email(
            settings=settings,
            to_email=to_email,
            subject=subject,
            body=body,
        )
        return EmailDeliveryResult(delivered=True)

    raise EmailDeliveryError("Unsupported email provider")


def _send_smtp_email(
    *,
    settings: Settings,
    to_email: str,
    subject: str,
    body: str,
) -> None:
    if settings.email_from is None or settings.smtp_host is None:
        raise EmailDeliveryError("SMTP email delivery is not configured")

    message = EmailMessage()
    message["From"] = settings.email_from
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(
            settings.smtp_host,
            settings.smtp_port,
            timeout=settings.smtp_timeout_seconds,
        ) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_username is not None:
                if settings.smtp_password is None:
                    raise EmailDeliveryError("SMTP password is required")
                smtp.login(
                    settings.smtp_username.get_secret_value(),
                    settings.smtp_password.get_secret_value(),
                )
            smtp.send_message(message)
    except EmailDeliveryError:
        raise
    except OSError as exc:
        raise EmailDeliveryError("SMTP email delivery failed") from exc
    except smtplib.SMTPException as exc:
        raise EmailDeliveryError("SMTP email delivery failed") from exc


def _build_auth_url(*, settings: Settings, path: str, token: str) -> str:
    base_url = settings.auth_email_base_url.rstrip("/")
    normalized_path = path if path.startswith("/") else f"/{path}"
    return f"{base_url}{normalized_path}?{urlencode({'token': token})}"
