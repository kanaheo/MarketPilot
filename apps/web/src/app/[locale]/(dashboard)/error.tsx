"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { ErrorState } from "@/components/common/error-state";
import { getMessages } from "@/i18n/messages";
import type { DashboardErrorProps } from "@/types/dashboard";
import type { Locale } from "@/types/i18n";

function resolveLocale(value: string | string[] | undefined): Locale {
  const locale = Array.isArray(value) ? value[0] : value;

  return locale === "en" || locale === "ja" ? locale : "ko";
}

export default function Error({ error, reset }: DashboardErrorProps) {
  const params = useParams<{ locale?: string | string[] }>();
  const locale = resolveLocale(params.locale);
  const messages = getMessages(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      actionLabel={messages.feedback.retry}
      description={messages.feedback.errorDescription}
      onRetry={reset}
      title={messages.feedback.errorTitle}
    />
  );
}
