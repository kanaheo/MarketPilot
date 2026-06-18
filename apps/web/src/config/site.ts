import type { Metadata } from "next";

import type { Locale } from "@/types/i18n";

type SiteMetadata = Record<Locale, Metadata>;

export const siteMetadata: SiteMetadata = {
  ko: {
    title: {
      default: "MarketPilot",
      template: "%s | MarketPilot",
    },
    description: "AI 기반 시장 분석과 모의투자를 위한 웹 애플리케이션",
  },
  en: {
    title: {
      default: "MarketPilot",
      template: "%s | MarketPilot",
    },
    description:
      "A web application for AI-assisted market analysis and paper trading",
  },
  ja: {
    title: {
      default: "MarketPilot",
      template: "%s | MarketPilot",
    },
    description: "AIを活用した市場分析とペーパートレードのWebアプリケーション",
  },
};
