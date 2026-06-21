import type { Messages } from "@/types/i18n";

export const portfolio = {
  header: {
    title: "ポートフォリオ",
    description:
      "資産配分、保有銘柄、キャッシュフロー、リスクを一か所で確認できます。",
  },
  summary: {
    label: "ポートフォリオ概要",
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
} as const satisfies Messages["portfolio"];
