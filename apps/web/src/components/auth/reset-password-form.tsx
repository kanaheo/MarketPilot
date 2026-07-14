"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import {
  createPasswordOnlySchema,
  type PasswordOnlyValues,
} from "@/lib/validation/auth";
import type { Locale, Messages } from "@/types/i18n";

type ResetPasswordFormProps = Readonly<{
  locale: Locale;
  messages: Messages["auth"];
  token: string | null;
}>;

export function ResetPasswordForm({
  locale,
  messages,
  token,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const passwordSchema = createPasswordOnlySchema(messages.password.invalid);

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setErrorMessage(messages.resetPassword.invalidTokenDescription);
      return;
    }

    const parsed = passwordSchema.safeParse({
      password,
    } satisfies PasswordOnlyValues);
    if (!parsed.success) {
      setErrorMessage(messages.password.invalid);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await fetch("/api/auth/password/reset/complete", {
      body: JSON.stringify({
        newPassword: password,
        token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(messages.resetPassword.invalidTokenDescription);
      return;
    }

    setHasSucceeded(true);
  }

  return (
    <div className="auth-card">
      <div className="auth-card-heading">
        <h2>
          {token
            ? messages.resetPassword.completeTitle
            : messages.resetPassword.invalidTokenTitle}
        </h2>
        <p>
          {token
            ? messages.resetPassword.completeDescription
            : messages.resetPassword.invalidTokenDescription}
        </p>
      </div>

      {hasSucceeded ? (
        <div className="auth-notice neutral" role="status">
          <CircleAlert size={17} aria-hidden="true" />
          <div>
            <strong>{messages.resetPassword.completeSuccessTitle}</strong>
            <span>{messages.resetPassword.completeSuccessDescription}</span>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="auth-notice error" role="alert">
          <CircleAlert size={17} aria-hidden="true" />
          <div>
            <strong>{messages.status.errorTitle}</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      ) : null}

      {hasSucceeded ? null : (
        <form className="auth-email-form" onSubmit={submitReset}>
          <div className="auth-email-fields">
            <div>
              <label htmlFor="reset-password">{messages.password.label}</label>
              <input
                autoComplete="new-password"
                disabled={isSubmitting || !token}
                id="reset-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={messages.password.placeholder}
                type="password"
                value={password}
              />
            </div>
            <button disabled={isSubmitting || !token} type="submit">
              {isSubmitting ? (
                <LoaderCircle
                  className="auth-spinner"
                  size={17}
                  aria-hidden="true"
                />
              ) : null}
              <span>{messages.resetPassword.completeAction}</span>
            </button>
          </div>
        </form>
      )}

      <p className="auth-switch">
        <Link href={`/${locale}/login`}>{messages.resetPassword.loginAction}</Link>
      </p>
    </div>
  );
}
