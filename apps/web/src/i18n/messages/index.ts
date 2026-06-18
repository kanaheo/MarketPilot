import type { Locale, Messages } from "@/types/i18n";

import { dashboard as enDashboard } from "./en/dashboard";
import { common as enCommon } from "./en/common";
import { dashboard as jaDashboard } from "./ja/dashboard";
import { common as jaCommon } from "./ja/common";
import { dashboard as koDashboard } from "./ko/dashboard";
import { common as koCommon } from "./ko/common";

const messages = {
  ko: {
    ...koCommon,
    dashboard: koDashboard,
  },
  en: {
    ...enCommon,
    dashboard: enDashboard,
  },
  ja: {
    ...jaCommon,
    dashboard: jaDashboard,
  },
} as const satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale) {
  return messages[locale];
}
