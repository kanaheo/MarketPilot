import type { Messages } from "@/types/i18n";

export const dashboard = {
  header: {
    greeting: "おはようございます、ギョンミンさん",
    description:
      "市場の変動性が高まっています。根拠とリスクを一緒に確認しましょう。",
    actions: {
      history: "取引履歴",
      addFunds: "仮想資金を追加",
    },
  },
  summary: {
    summaryLabel: "ポートフォリオの主要指標",
    cards: {
      totalValue: {
        label: "総評価額",
        value: "₩15,873,420",
        detail: "↗ +8.73%",
        detailAside: "投資収益 +₩873,420",
      },
      availableCash: {
        label: "投資可能な現金",
        value: "₩3,214,800",
        detail: "現金比率 20.3%",
        detailAside: "最近の入金 +₩5,000,000",
      },
      todayProfit: {
        label: "本日の損益",
        value: "+₩184,260",
        detail: "↗ +1.18%",
        detailAside: "S&P 500比 +0.62%",
      },
      maxDrawdown: {
        label: "最大ドローダウン",
        value: "-4.82%",
        detail: "リスク予算の48%",
        detailAside: "上限 -10%",
      },
    },
  },
} as const satisfies Messages["dashboard"];
