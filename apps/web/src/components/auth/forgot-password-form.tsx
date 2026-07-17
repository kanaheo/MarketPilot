"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import type { Locale, Messages } from "@/types/i18n";

type ForgotPasswordFormProps = Readonly<{
  locale: Locale;
  messages: Messages["auth"];
}>;

export function ForgotPasswordForm({
  locale,
  messages,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  async function submitResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setHasFailed(false);

    const response = await fetch("/api/auth/password/reset/request", {
      body: JSON.stringify({ email, locale }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setHasFailed(true);
      setHasSucceeded(false);
      setResetLink(null);
      return;
    }

    const body = (await response.json()) as { dev_token?: string | null };
    setResetLink(
      body.dev_token
        ? `/${locale}/reset-password?token=${encodeURIComponent(body.dev_token)}`
        : null,
    );
    setHasSucceeded(true);
  }

  return (
    <div className="auth-card">
      <div className="auth-card-heading">
        <h2>{messages.resetPassword.requestTitle}</h2>
        <p>{messages.resetPassword.requestDescription}</p>
      </div>

      {hasSucceeded ? (
        <div className="auth-notice neutral" role="status">
          <CircleAlert size={17} aria-hidden="true" />
          <div>
            <strong>{messages.resetPassword.requestSuccessTitle}</strong>
            <span>{messages.resetPassword.requestSuccessDescription}</span>
            {resetLink ? (
              <Link href={resetLink}>{messages.resetPassword.devResetLink}</Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {hasFailed ? (
        <div className="auth-notice error" role="alert">
          <CircleAlert size={17} aria-hidden="true" />
          <div>
            <strong>{messages.status.errorTitle}</strong>
            <span>{messages.status.errorDescription}</span>
          </div>
        </div>
      ) : null}

      <form className="auth-email-form" onSubmit={submitResetRequest}>
        <div className="auth-email-fields">
          <div>
            <label htmlFor="forgot-password-email">{messages.email.label}</label>
            <input
              autoComplete="email"
              disabled={isSubmitting}
              id="forgot-password-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={messages.email.placeholder}
              required
              type="email"
              value={email}
            />
          </div>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <LoaderCircle
                className="auth-spinner"
                size={17}
                aria-hidden="true"
              />
            ) : null}
            <span>{messages.resetPassword.requestAction}</span>
          </button>
        </div>
      </form>

      <p className="auth-switch">
        <Link href={`/${locale}/login`}>{messages.resetPassword.loginAction}</Link>
      </p>
    </div>
  );
}
