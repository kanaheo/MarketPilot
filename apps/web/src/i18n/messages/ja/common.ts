import type { Messages } from "@/types/i18n";

export const common = {
  navigation: {
    ariaLabel: "メインメニュー",
    items: {
      dashboard: "ダッシュボード",
      portfolio: "ポートフォリオ",
      markets: "市場検索",
      backtests: "戦略シミュレーション",
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
    fallbackName: "MarketPilotユーザー",
    role: "ペーパー投資家",
    signOut: "ログアウト",
  },
  feedback: {
    loading: "ダッシュボードを読み込んでいます。",
    retry: "もう一度試す",
    errorTitle: "ダッシュボードを読み込めませんでした",
    errorDescription:
      "しばらくしてから再度お試しください。問題が続く場合はネットワーク接続を確認してください。",
  },
} as const satisfies Omit<
  Messages,
  "auth" | "backtests" | "dashboard" | "markets" | "portfolio"
>;
