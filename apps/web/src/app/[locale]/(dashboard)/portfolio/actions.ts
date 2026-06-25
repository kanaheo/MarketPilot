"use server";

import { revalidatePath } from "next/cache";

import { assertLocale } from "@/i18n/config";
import { MarketPilotApiError } from "@/lib/server/marketpilot-api";
import { createPortfolio } from "@/lib/server/portfolio-api";
import type { PortfolioCreateFormValues } from "@/lib/validation/portfolios";
import type { Locale } from "@/types/i18n";
import type {
  PortfolioCreateActionResult,
  PortfolioCreateFailureReason,
} from "@/types/portfolio";

function getCreatePortfolioFailureReason(
  error: unknown,
): PortfolioCreateFailureReason {
  if (error instanceof MarketPilotApiError) {
    if (error.status === 401 || error.status === 403) {
      return "unauthorized";
    }

    if (error.status === 409) {
      return "conflict";
    }

    if (error.status === 422) {
      return "invalid";
    }
  }

  return "unknown";
}

export async function createPortfolioAction(
  locale: Locale,
  values: PortfolioCreateFormValues,
): Promise<PortfolioCreateActionResult> {
  assertLocale(locale);

  try {
    await createPortfolio({
      name: values.name,
      base_currency: values.baseCurrency,
      initial_capital: String(values.initialCapital),
    });
    revalidatePath(`/${locale}/portfolio`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: getCreatePortfolioFailureReason(error),
    };
  }
}
