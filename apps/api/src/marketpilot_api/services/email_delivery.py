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


@dataclass(frozen=True)
class _EmailTemplate:
    subject: str
    body: str


_VERIFICATION_TEMPLATES: dict[str, _EmailTemplate] = {
    "ko": _EmailTemplate(
        subject="MarketPilot 이메일 인증",
        body=(
            "MarketPilot 이메일 주소를 인증해 주세요.\n\n"
            "{url}\n\n"
            "이 링크는 24시간 동안 사용할 수 있습니다."
        ),
    ),
    "en": _EmailTemplate(
        subject="Verify your MarketPilot email",
        body=(
            "Verify your MarketPilot email address:\n\n"
            "{url}\n\n"
            "This link expires in 24 hours."
        ),
    ),
    "ja": _EmailTemplate(
        subject="MarketPilot メール確認",
        body=(
            "MarketPilotのメールアドレスを確認してください。\n\n"
            "{url}\n\n"
            "このリンクは24時間有効です。"
        ),
    ),
}

_PASSWORD_RESET_TEMPLATES: dict[str, _EmailTemplate] = {
    "ko": _EmailTemplate(
        subject="MarketPilot 비밀번호 재설정",
        body=(
            "MarketPilot 비밀번호를 재설정해 주세요.\n\n"
            "{url}\n\n"
            "이 링크는 30분 동안 사용할 수 있습니다. 요청한 적이 없다면 "
            "이 메일은 무시해도 됩니다."
        ),
    ),
    "en": _EmailTemplate(
        subject="Reset your MarketPilot password",
        body=(
            "Reset your MarketPilot password:\n\n"
            "{url}\n\n"
            "This link expires in 30 minutes. If you did not request this, "
            "you can ignore this email."
        ),
    ),
    "ja": _EmailTemplate(
        subject="MarketPilot パスワード再設定",
        body=(
            "MarketPilotのパスワードを再設定してください。\n\n"
            "{url}\n\n"
            "このリンクは30分有効です。心当たりがない場合は、このメールを"
            "無視してください。"
        ),
    ),
}


def send_email_verification(
    *,
    settings: Settings,
    to_email: str,
    token: str,
    locale: str,
) -> EmailDeliveryResult:
    verification_url = _build_auth_url(
        settings=settings,
        locale=locale,
        path="/verify-email",
        token=token,
    )
    template = _get_template(_VERIFICATION_TEMPLATES, locale)
    return _send_auth_email(
        settings=settings,
        to_email=to_email,
        subject=template.subject,
        body=template.body.format(url=verification_url),
    )


def send_password_reset(
    *,
    settings: Settings,
    to_email: str,
    token: str,
    locale: str,
) -> EmailDeliveryResult:
    reset_url = _build_auth_url(
        settings=settings,
        locale=locale,
        path="/reset-password",
        token=token,
    )
    template = _get_template(_PASSWORD_RESET_TEMPLATES, locale)
    return _send_auth_email(
        settings=settings,
        to_email=to_email,
        subject=template.subject,
        body=template.body.format(url=reset_url),
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


def _build_auth_url(
    *,
    settings: Settings,
    locale: str,
    path: str,
    token: str,
) -> str:
    base_url = settings.auth_email_base_url.rstrip("/")
    normalized_path = path if path.startswith("/") else f"/{path}"
    return f"{base_url}/{locale}{normalized_path}?{urlencode({'token': token})}"


def _get_template(
    templates: dict[str, _EmailTemplate],
    locale: str,
) -> _EmailTemplate:
    return templates.get(locale, templates["en"])
