import type { Locale, Messages } from "@/types/i18n";

import { auth as enAuth } from "./en/auth";
import { dashboard as enDashboard } from "./en/dashboard";
import { common as enCommon } from "./en/common";
import { auth as jaAuth } from "./ja/auth";
import { dashboard as jaDashboard } from "./ja/dashboard";
import { common as jaCommon } from "./ja/common";
import { auth as koAuth } from "./ko/auth";
import { dashboard as koDashboard } from "./ko/dashboard";
import { common as koCommon } from "./ko/common";

const messages = {
  ko: {
    ...koCommon,
    auth: koAuth,
    dashboard: koDashboard,
  },
  en: {
    ...enCommon,
    auth: enAuth,
    dashboard: enDashboard,
  },
  ja: {
    ...jaCommon,
    auth: jaAuth,
    dashboard: jaDashboard,
  },
} as const satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale) {
  return messages[locale];
}
