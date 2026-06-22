import type { Messages } from "@/types/i18n";

export const backtests = {
  header: {
    eyebrow: "ストラテジーラボ",
    title: "戦略シミュレーション",
    description: "再現可能な条件で投資戦略の過去成績とリスクを検証します。",
    dataBadge: "Fixture設定・実際の運用成績ではありません",
  },
  setup: {
    title: "シミュレーション設定",
    description: "検証期間、資金、戦略、比較ベンチマークを選択します。",
    fields: {
      startDate: "開始日",
      endDate: "終了日",
      initialCapital: "初期資金",
      currency: "基準通貨",
      benchmark: "ベンチマーク",
      strategy: "戦略プリセット",
    },
    hints: {
      initialCapital: "入出金を行う前の開始残高",
    },
    options: {
      currencies: [
        { label: "米ドル（USD）", value: "USD" },
        { label: "韓国ウォン（KRW）", value: "KRW" },
        { label: "日本円（JPY）", value: "JPY" },
      ],
      benchmarks: [
        { label: "S&P 500 ETF（SPY）", value: "SPY" },
        { label: "KOSPI指数", value: "KOSPI" },
        { label: "日経225", value: "NIKKEI225" },
      ],
    },
    strategies: {
      momentum: {
        title: "モメンタム",
        description: "相対的な勢いが強い銘柄へ定期的に入れ替えます。",
      },
      movingAverage: {
        title: "移動平均",
        description: "短期・長期移動平均の方向で売買を判断します。",
      },
      buyAndHold: {
        title: "Buy & Hold",
        description: "選択した資産を購入し、期間終了まで保有します。",
      },
    },
  },
  risk: {
    title: "リスクと執行条件",
    description: "ポジション制限と現実的な取引コストを設定します。",
    fields: {
      maxPositionWeight: "最大銘柄比率",
      cashReserve: "現金保有比率",
      stopLoss: "損切り基準",
      rebalanceFrequency: "リバランス周期",
      feeRate: "取引手数料",
      slippageRate: "スリッページ",
      executionTiming: "約定タイミング",
    },
    hints: {
      maxPositionWeight: "1銘柄に配分できる最大比率",
      cashReserve: "市場に投資せず残しておく現金",
      stopLoss: "0%に設定すると損切りルールを無効にします。",
      executionTiming: "未来の価格を先に使うバイアスを防ぎます。",
    },
    options: {
      rebalanceFrequencies: [
        { label: "毎週", value: "weekly" },
        { label: "毎月", value: "monthly" },
        { label: "四半期ごと", value: "quarterly" },
      ],
      executionTimings: [
        { label: "翌営業日の始値", value: "nextOpen" },
        { label: "シグナル発生日の終値", value: "sameClose" },
      ],
    },
  },
  action: {
    noticeTitle: "現在は設定検証のみ行います。",
    noticeDescription:
      "収益率、チャート、取引結果は次の段階でFixtureとして接続します。",
    run: "設定を検証",
    validating: "検証中...",
    validated: "設定検証完了",
  },
  validation: {
    required: "必須項目です。",
    number: "正しい数値を入力してください。",
    initialCapital: "初期資金は1,000以上にしてください。",
    percentage: "1%から100%の間で入力してください。",
    stopLoss: "損切り基準は0%から50%の間で入力してください。",
    cost: "取引コストは0%から5%の間で入力してください。",
    dateRange: "終了日は開始日より後にしてください。",
    allocation: "最大銘柄比率と現金比率の合計は100%を超えられません。",
  },
} as const satisfies Messages["backtests"];
