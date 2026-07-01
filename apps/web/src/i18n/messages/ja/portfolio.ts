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
  createForm: {
    title: "最初のポートフォリオを作成",
    description:
      "名前、基準通貨、初期資金を入力すると、ポートフォリオと初回入金が一緒に作成されます。",
    fields: {
      name: {
        label: "ポートフォリオ名",
        placeholder: "例: 長期成長ポートフォリオ",
      },
      baseCurrency: {
        label: "基準通貨",
      },
      initialCapital: {
        label: "初期資金",
        placeholder: "10000",
      },
    },
    currencies: [
      { label: "米ドル (USD)", value: "USD" },
      { label: "韓国ウォン (KRW)", value: "KRW" },
      { label: "日本円 (JPY)", value: "JPY" },
    ],
    submit: "ポートフォリオを作成",
    submitting: "作成中...",
    success: "ポートフォリオを作成しました。",
    errors: {
      unauthorized: "ログインが必要です。再度ログインしてからお試しください。",
      invalid: "入力内容を確認してください。",
      conflict: "リクエストを処理できません。入力内容を確認してください。",
      unknown:
        "ポートフォリオを作成できませんでした。しばらくしてからもう一度お試しください。",
    },
    validation: {
      nameRequired: "ポートフォリオ名を入力してください。",
      nameLength: "ポートフォリオ名は120文字以内で入力してください。",
      currency: "対応している通貨を選択してください。",
      initialCapitalRequired: "初期資金を入力してください。",
      initialCapitalPositive: "初期資金は0より大きい必要があります。",
    },
  },
  selector: {
    label: "ポートフォリオを選択",
    currentCash: "利用可能な現金",
    createAnother: "別のポートフォリオを作成",
  },
  summary: {
    label: "ポートフォリオ概要",
    unavailable: "まだ計算できません",
    cards: {
      totalValue: "総評価額",
      availableCash: "利用可能な現金",
      totalReturn: "総収益率",
      realizedProfitLoss: "実現損益",
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
      TRADE_BUY: "買い約定",
      TRADE_SELL: "売り約定",
    },
    empty: {
      title: "現金アクティビティはありません",
      description: "入金とペーパー購入の履歴がここに表示されます。",
    },
  },
  cashTransactionForm: {
    title: "現金の入出金",
    description:
      "選択中のポートフォリオの現金元帳に入金または出金を記録します。",
    fields: {
      transactionType: {
        label: "取引種別",
        options: {
          deposit: "入金",
          withdrawal: "出金",
        },
      },
      amount: {
        label: "金額",
        placeholder: "100000",
      },
      note: {
        label: "メモ",
        placeholder: "任意",
      },
    },
    submit: "現金取引を記録",
    submitting: "記録中...",
    success: "現金取引を記録しました。",
    errors: {
      unauthorized: "ログインが必要です。再度ログインしてからお試しください。",
      invalid: "入力内容を確認してください。",
      conflict: "出金可能な現金が不足しています。",
      notFound: "ポートフォリオが見つかりません。",
      unknown:
        "現金取引を記録できませんでした。しばらくしてからもう一度お試しください。",
    },
    validation: {
      transactionType: "取引種別を選択してください。",
      amountRequired: "金額を入力してください。",
      amountPositive: "金額は0より大きい必要があります。",
      noteLength: "メモは500文字以内で入力してください。",
    },
  },
  orderForm: {
    title: "ペーパー注文を記録",
    description:
      "選択中のポートフォリオに市場注文または指値注文を待機状態で記録します。",
    fields: {
      symbol: {
        label: "銘柄シンボル",
        placeholder: "例: AAPL",
      },
      side: {
        label: "売買区分",
        options: {
          buy: "買い",
          sell: "売り",
        },
      },
      orderType: {
        label: "注文種別",
        options: {
          market: "成行",
          limit: "指値",
        },
      },
      quantity: {
        label: "数量",
        placeholder: "10",
      },
      limitPrice: {
        label: "指値価格",
        placeholder: "成行の場合は空欄",
      },
      decisionEvidence: {
        label: "判断根拠",
        placeholder: "任意",
      },
    },
    submit: "注文を記録",
    submitting: "記録中...",
    success: "注文を記録しました。",
    errors: {
      unauthorized: "ログインが必要です。再度ログインしてからお試しください。",
      conflict: "注文可能な現金または保有数量を確認してください。",
      invalid: "注文の入力内容を確認してください。",
      notFound: "ポートフォリオが見つかりません。",
      unknown:
        "注文を記録できませんでした。しばらくしてからもう一度お試しください。",
    },
    validation: {
      decisionEvidenceLength: "判断根拠は2000文字以内で入力してください。",
      limitPricePositive: "指値価格は0より大きい必要があります。",
      limitPriceRequired: "指値注文には指値価格が必要です。",
      marketLimitPrice: "成行注文では指値価格を入力しません。",
      orderType: "注文種別を選択してください。",
      quantityDecimalPlaces: "数量は小数第2位まで入力してください。",
      quantityPositive: "数量は0より大きい必要があります。",
      quantityRequired: "数量を入力してください。",
      side: "買いまたは売りを選択してください。",
      symbolFormat: "銘柄シンボルの形式を確認してください。",
      symbolRequired: "銘柄シンボルを入力してください。",
    },
  },
  orders: {
    title: "最近の注文",
    description: "選択中のポートフォリオの最近のペーパー注文履歴",
    columns: {
      symbol: "銘柄",
      side: "区分",
      type: "種別",
      quantity: "数量",
      price: "価格",
      status: "状態",
      createdAt: "記録日",
      actions: "操作",
    },
    sides: {
      BUY: "買い",
      SELL: "売り",
    },
    types: {
      LIMIT: "指値",
      MARKET: "成行",
    },
    statuses: {
      CANCELLED: "取消",
      FILLED: "約定",
      PENDING: "待機",
      REJECTED: "拒否",
    },
    marketPrice: "成行",
    update: "修正",
    updateQuantityLabel: "注文数量",
    updateErrors: {
      unauthorized: "ログインが必要です。再度ログインしてからお試しください。",
      invalid: "数量を確認してください。",
      conflict: "修正可能な現金または保有数量を確認してください。",
      notFound: "注文が見つかりません。",
      unknown: "注文を修正できませんでした。しばらくしてからもう一度お試しください。",
    },
    execute: "約定",
    executePriceLabel: "約定価格",
    executePricePlaceholder: "約定価格",
    executeErrors: {
      unauthorized: "ログインが必要です。再度ログインしてからお試しください。",
      invalid: "約定価格を確認してください。",
      conflict:
        "約定できませんでした。現金、保有数量、注文状態を確認してください。",
      notFound: "注文が見つかりません。",
      unknown: "注文を約定できませんでした。しばらくしてからもう一度お試しください。",
    },
    cancel: "取消",
    delete: "削除",
    empty: {
      title: "注文はありません",
      description: "最初のペーパー注文を記録すると、ここに表示されます。",
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
