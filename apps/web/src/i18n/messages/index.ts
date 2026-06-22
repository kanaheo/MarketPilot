import type { Locale, Messages } from "@/types/i18n";

import { auth as enAuth } from "./en/auth";
import { backtests as enBacktests } from "./en/backtests";
import { dashboard as enDashboard } from "./en/dashboard";
import { markets as enMarkets } from "./en/markets";
import { portfolio as enPortfolio } from "./en/portfolio";
import { common as enCommon } from "./en/common";
import { auth as jaAuth } from "./ja/auth";
import { backtests as jaBacktests } from "./ja/backtests";
import { dashboard as jaDashboard } from "./ja/dashboard";
import { markets as jaMarkets } from "./ja/markets";
import { portfolio as jaPortfolio } from "./ja/portfolio";
import { common as jaCommon } from "./ja/common";
import { auth as koAuth } from "./ko/auth";
import { backtests as koBacktests } from "./ko/backtests";
import { dashboard as koDashboard } from "./ko/dashboard";
import { markets as koMarkets } from "./ko/markets";
import { portfolio as koPortfolio } from "./ko/portfolio";
import { common as koCommon } from "./ko/common";

const messages = {
  ko: {
    ...koCommon,
    auth: koAuth,
    backtests: koBacktests,
    dashboard: koDashboard,
    markets: koMarkets,
    portfolio: koPortfolio,
  },
  en: {
    ...enCommon,
    auth: enAuth,
    backtests: enBacktests,
    dashboard: enDashboard,
    markets: enMarkets,
    portfolio: enPortfolio,
  },
  ja: {
    ...jaCommon,
    auth: jaAuth,
    backtests: jaBacktests,
    dashboard: jaDashboard,
    markets: jaMarkets,
    portfolio: jaPortfolio,
  },
} as const satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale) {
  return messages[locale];
}
