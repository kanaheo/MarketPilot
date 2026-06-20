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
} as const satisfies Messages["portfolio"];
