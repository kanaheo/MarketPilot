import type { Messages } from "@/types/i18n";

export const common = {
  navigation: {
    ariaLabel: "メインメニュー",
    items: {
      dashboard: "ダッシュボード",
      portfolio: "ポートフォリオ",
      markets: "市場検索",
      backtests: "バックテスト",
      data: "データ",
    },
    settings: "設定",
  },
  topBar: {
    marketOpen: "米国市場は取引中",
    marketCloseTime: "終了まで3時間24分",
    notifications: "通知",
    portfolio: "成長型ポートフォリオ",
  },
  languageSelector: {
    label: "言語を選択",
  },
  user: {
    role: "ペーパー投資家",
  },
} as const satisfies Omit<Messages, "dashboard">;
