import type { PortfolioMessages } from "@/types/i18n/portfolio";

export const portfolio = {
  header: {
    title: "ポートフォリオ",
    description:
      "資産配分、保有銘柄、キャッシュフロー、リスクを一か所で確認できます。",
  },
  pageState: {
    empty: {
      title: "ポートフォリオがまだありません",
      description:
        "最初のペーパーポートフォリオを作成すると、現金活動を記録できます。",
    },
  },
  summary: {
    label: "ポートフォリオ概要",
    unavailable: "まだ計算できません",
    cards: {
      totalValue: "総評価額",
      availableCash: "利用可能な現金",
      totalReturn: "総収益率",
      maxDrawdown: "最大ドローダウン",
    },
  },
  valueChart: {
    title: "ポートフォリオ価値",
    chartLabel: "ポートフォリオ価値とS&P 500の比較チャート",
    portfolio: "マイポートフォリオ",
    benchmark: "S&P 500",
    periodLabel: "ポートフォリオ価値の表示期間",
    periods: [
      { label: "1か月", active: true },
      { label: "3か月", active: false },
      { label: "6か月", active: false },
      { label: "1年", active: false },
    ],
  },
  allocation: {
    title: "資産配分",
    chartLabel: "資産配分ドーナツチャート",
    totalValue: "総評価額",
    items: {
      stocks: "株式",
      etfs: "ETF",
      cash: "現金",
    },
  },
  holdings: {
    title: "保有銘柄",
    description: "現在のペーパーポジション · 現金を除く",
    shareUnit: "株",
    columns: {
      asset: "資産",
      quantity: "数量",
      averagePrice: "平均取得価格",
      currentPrice: "現在値",
      marketValue: "評価額",
      returnRate: "収益率",
    },
    empty: {
      title: "保有銘柄がありません",
      description:
        "最初のペーパー注文が約定すると、保有銘柄が表示されます。",
    },
  },
  cashActivity: {
    title: "現金アクティビティ",
    description: "最近の現金元帳履歴",
    balance: "利用可能な現金",
    items: {
      INITIAL_DEPOSIT: "初回入金",
      DEPOSIT: "入金",
      WITHDRAWAL: "出金",
      FEE: "手数料",
      DIVIDEND: "配当",
    },
    empty: {
      title: "現金アクティビティはありません",
      description: "入金とペーパー購入の履歴がここに表示されます。",
    },
  },
  risk: {
    title: "リスク概要",
    description: "現在のポートフォリオリスク指標",
    status: {
      good: "良好",
      moderate: "中程度",
      measured: "測定値",
    },
    items: {
      diversification: {
        title: "分散投資",
        description: "株式、ETF、現金に分散",
      },
      concentration: {
        title: "集中度",
        description: "上位3資産が71%を占有",
      },
      volatility: {
        title: "ボラティリティ（1年）",
        description: "年率換算ポートフォリオ変動率",
      },
    },
  },
} as const satisfies PortfolioMessages;
