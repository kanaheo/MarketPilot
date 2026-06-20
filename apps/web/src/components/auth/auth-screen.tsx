"use client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { GoogleIcon } from "@/components/auth/provider-icons";
import { LanguageSelector } from "@/components/navigation/language-selector";
import {
  createEmailAuthSchema,
  type EmailAuthValues,
} from "@/lib/validation/auth";
import type {
  AuthMode,
  AuthProvider,
  AuthScreenProps,
  AuthStatus,
} from "@/types/auth";

export function AuthScreen({
  googleAuthEnabled,
  initialMode,
  locale,
  messages,
  status: initialStatus,
}: AuthScreenProps) {
  const [status, setStatus] = useState<AuthStatus>(initialStatus);
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(
    null,
  );
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    trigger,
  } = useForm<EmailAuthValues>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(createEmailAuthSchema(messages.email.invalid)),
  });

  const mode = initialMode;
  const modeMessages = messages[mode];
  const alternateMode: AuthMode = mode === "login" ? "signup" : "login";
  const alternateHref = `/${locale}/${alternateMode}`;

  async function startGoogleAuth() {
    setActiveProvider("google");
    setStatus("loading");

    try {
      await signIn("google", {
        redirectTo: `/${locale}`,
      });
    } catch {
      setActiveProvider(null);
      setStatus("error");
    }
  }

  async function submitEmail() {
    setActiveProvider("email");
    setStatus("loading");

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    setActiveProvider(null);
    setStatus("idle");
  }

  const isLoading = status === "loading" || isSubmitting;

  return (
    <div className="auth-shell">
      <section className="auth-story" aria-label={messages.story.ariaLabel}>
        <div className="auth-story-glow one" />
        <div className="auth-story-glow two" />

        <Link className="auth-brand" href={`/${locale}`}>
          <span className="auth-brand-mark" aria-hidden="true">
            <Activity size={21} strokeWidth={2.4} />
          </span>
          <span>MarketPilot</span>
        </Link>

        <div className="auth-story-content">
          <span className="auth-eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            {messages.story.eyebrow}
          </span>
          <h1>{messages.story.title}</h1>
          <p>{messages.story.description}</p>

          <div className="auth-preview" aria-hidden="true">
            <div className="auth-preview-heading">
              <span>{messages.story.previewLabel}</span>
              <span className="auth-live-dot" />
            </div>
            <div className="auth-preview-value">+8.73%</div>
            <svg viewBox="0 0 420 130">
              <defs>
                <linearGradient id="authChartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8ce0ce" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8ce0ce" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M4 102 C52 80, 72 92, 110 72 S170 82, 208 53 S266 62, 310 35 S370 41, 416 12 L416 128 L4 128 Z"
                fill="url(#authChartFill)"
              />
              <path
                d="M4 102 C52 80, 72 92, 110 72 S170 82, 208 53 S266 62, 310 35 S370 41, 416 12"
                fill="none"
                stroke="#8ce0ce"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
          </div>

          <ul className="auth-benefits">
            {messages.story.benefits.map((benefit) => (
              <li key={benefit}>
                <span aria-hidden="true">
                  <Check size={13} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-story-note">
          <ShieldCheck size={15} aria-hidden="true" />
          {messages.story.note}
        </p>
      </section>

      <section className="auth-workspace">
        <div className="auth-toolbar">
          <LanguageSelector
            ariaLabel={messages.languageLabel}
            locale={locale}
          />
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-icon" aria-hidden="true">
              {mode === "login" ? (
                <LockKeyhole size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </span>
            <h2>{modeMessages.title}</h2>
            <p>{modeMessages.description}</p>
          </div>

          {status === "error" ? (
            <div className="auth-notice error" role="alert">
              <CircleAlert size={17} aria-hidden="true" />
              <div>
                <strong>{messages.status.errorTitle}</strong>
                <span>{messages.status.errorDescription}</span>
              </div>
              <button
                aria-label={messages.status.dismiss}
                onClick={() => setStatus("idle")}
                type="button"
              >
                <X size={15} />
              </button>
            </div>
          ) : null}

          {status === "cancelled" ? (
            <div className="auth-notice neutral" role="status">
              <CircleAlert size={17} aria-hidden="true" />
              <div>
                <strong>{messages.status.cancelledTitle}</strong>
                <span>{messages.status.cancelledDescription}</span>
              </div>
              <button
                aria-label={messages.status.dismiss}
                onClick={() => setStatus("idle")}
                type="button"
              >
                <X size={15} />
              </button>
            </div>
          ) : null}

          <div className="auth-provider-grid">
            <button
              className="auth-provider-button"
              disabled={isLoading || !googleAuthEnabled}
              onClick={() => {
                void startGoogleAuth();
              }}
              type="button"
            >
              {isLoading && activeProvider === "google" ? (
                <LoaderCircle
                  className="auth-spinner"
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <GoogleIcon />
              )}
              <span>
                {isLoading && activeProvider === "google"
                  ? messages.status.connecting
                  : messages.providers.google[mode]}
              </span>
            </button>
          </div>

          <div className="auth-divider">
            <span>{messages.or}</span>
          </div>

          <form
            className="auth-email-form"
            noValidate
            onSubmit={handleSubmit(submitEmail)}
          >
            <label htmlFor={`${mode}-email`}>{messages.email.label}</label>
            <div className="auth-email-control">
              <input
                aria-describedby={
                  errors.email ? `${mode}-email-error` : undefined
                }
                aria-invalid={errors.email ? "true" : "false"}
                autoComplete="email"
                disabled={isLoading}
                id={`${mode}-email`}
                placeholder={messages.email.placeholder}
                type="email"
                {...register("email", {
                  onBlur: () => {
                    void trigger("email");
                  },
                  onChange: () => {
                    void trigger("email");
                  },
                })}
              />
              <button disabled={isLoading} type="submit">
                {isLoading && activeProvider === "email" ? (
                  <LoaderCircle
                    className="auth-spinner"
                    size={17}
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight size={17} aria-hidden="true" />
                )}
                <span>{modeMessages.emailAction}</span>
              </button>
            </div>
            {errors.email ? (
              <p
                className="auth-field-error"
                id={`${mode}-email-error`}
                role="alert"
              >
                <CircleAlert size={14} strokeWidth={2.25} aria-hidden="true" />
                <span>{errors.email.message}</span>
              </p>
            ) : null}
          </form>

          <p className="auth-switch">
            {modeMessages.switchPrompt}{" "}
            <Link href={alternateHref}>{modeMessages.switchAction}</Link>
          </p>

          <p className="auth-terms">
            {modeMessages.termsPrefix} <a href="#terms">{messages.terms}</a>
            {messages.termsSeparator}
            <a href="#privacy">{messages.privacy}</a>
            {modeMessages.termsSuffix}
          </p>
        </div>

        <div className="auth-trust-row">
          <span>
            <ShieldCheck size={14} />
            {messages.trust.secure}
          </span>
          <span>
            <BarChart3 size={14} />
            {messages.trust.paperOnly}
          </span>
        </div>
      </section>
    </div>
  );
}
