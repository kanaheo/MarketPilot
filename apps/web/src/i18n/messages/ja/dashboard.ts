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
        detail: "投資収益",
      },
      availableCash: {
        label: "投資可能な現金",
        detail: "現金比率",
        detailAside: "最近の入金",
      },
      todayProfit: {
        label: "本日の損益",
        detail: "S&P 500比",
      },
      maxDrawdown: {
        label: "最大ドローダウン",
        detail: "リスク予算の使用率",
        detailAside: "上限",
      },
    },
  },
  performance: {
    title: "ポートフォリオ成績",
    description: "キャッシュフローを除いた時間加重収益率",
    chartLabel: "ポートフォリオとS&P 500の成績比較チャート",
    portfolio: "マイポートフォリオ",
    benchmark: "S&P 500",
    periodLabel: "成績の表示期間",
    periods: [
      { label: "1週", active: false },
      { label: "1か月", active: true },
      { label: "3か月", active: false },
      { label: "1年", active: false },
    ],
  },
  watchlist: {
    title: "ウォッチリスト",
    updated: "10秒前に更新",
    realtime: "サンプル価格",
    manage: "ウォッチリストを管理",
    columns: {
      symbol: "銘柄",
      price: "現在値",
      change: "騰落率",
      trend: "推移（1日）",
    },
  },
  signals: {
    title: "AI市場シグナル",
    description: "本日09:30時点の分析",
    viewAll: "すべて表示",
    probability: "上昇可能性",
    disclaimer:
      "シグナルは投資助言ではありません。モデルの過去成績と現在のリスクを併せて確認してください。",
    risks: {
      low: "低リスク",
      medium: "中リスク",
      high: "高リスク",
    },
    items: {
      amd: {
        title: "上昇を注視",
        description: "AI半導体需要と直近の業績モメンタムが改善",
      },
      xle: {
        title: "関心が上昇",
        description: "地政学リスクと原油価格の変動性が拡大",
      },
      tlt: {
        title: "中立へ転換",
        description: "米国雇用の鈍化と金利見通しの変化",
      },
    },
  },
  holdings: {
    title: "保有銘柄",
    description: "現在3銘柄 · 現金を除く",
    viewPortfolio: "ポートフォリオを見る",
    viewAll: "すべての保有銘柄を見る",
    shareUnit: "株",
    columns: {
      symbol: "銘柄",
      quantity: "保有数",
      value: "評価額",
      returnRate: "収益率",
    },
  },
  activity: {
    title: "口座アクティビティ",
    description: "最近のキャッシュフローと注文",
    more: "口座アクティビティメニュー",
    viewAll: "取引履歴をすべて見る",
    items: {
      deposit: {
        title: "追加入金",
        detail: "仮想資金",
      },
      nvdaBuy: {
        title: "NVDAを購入",
        detail: "4株 · $1,742.40",
      },
      amdSell: {
        title: "AMDを売却",
        detail: "2株 · $165.80",
      },
    },
  },
} as const satisfies Messages["dashboard"];
