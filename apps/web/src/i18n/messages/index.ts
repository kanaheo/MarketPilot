import type { Locale, Messages } from "@/types/i18n";

import { auth as enAuth } from "./en/auth";
import { dashboard as enDashboard } from "./en/dashboard";
import { portfolio as enPortfolio } from "./en/portfolio";
import { common as enCommon } from "./en/common";
import { auth as jaAuth } from "./ja/auth";
import { dashboard as jaDashboard } from "./ja/dashboard";
import { portfolio as jaPortfolio } from "./ja/portfolio";
import { common as jaCommon } from "./ja/common";
import { auth as koAuth } from "./ko/auth";
import { dashboard as koDashboard } from "./ko/dashboard";
import { portfolio as koPortfolio } from "./ko/portfolio";
import { common as koCommon } from "./ko/common";

const messages = {
  ko: {
    ...koCommon,
    auth: koAuth,
    dashboard: koDashboard,
    portfolio: koPortfolio,
  },
  en: {
    ...enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    portfolio: enPortfolio,
  },
  ja: {
    ...jaCommon,
    auth: jaAuth,
    dashboard: jaDashboard,
    portfolio: jaPortfolio,
  },
} as const satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale) {
  return messages[locale];
}
