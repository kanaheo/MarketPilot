import type { Messages } from "@/types/i18n";

export const backtests = {
  header: {
    eyebrow: "Strategy lab",
    title: "Strategy Backtest",
    description:
      "Test a strategy's historical performance and risk under reproducible assumptions.",
    dataBadge: "Fixture setup · Not actual performance",
  },
  setup: {
    title: "Simulation setup",
    description:
      "Choose the period, capital, strategy, and comparison benchmark.",
    fields: {
      startDate: "Start date",
      endDate: "End date",
      initialCapital: "Initial capital",
      currency: "Base currency",
      benchmark: "Benchmark",
      strategy: "Strategy preset",
    },
    hints: {
      initialCapital: "Starting balance before deposits or withdrawals",
    },
    options: {
      currencies: [
        { label: "US Dollar (USD)", value: "USD" },
        { label: "Korean Won (KRW)", value: "KRW" },
        { label: "Japanese Yen (JPY)", value: "JPY" },
      ],
      benchmarks: [
        { label: "S&P 500 ETF (SPY)", value: "SPY" },
        { label: "KOSPI Index", value: "KOSPI" },
        { label: "Nikkei 225", value: "NIKKEI225" },
      ],
    },
    strategies: {
      momentum: {
        title: "Momentum",
        description:
          "Periodically rotates into assets with stronger relative momentum.",
      },
      movingAverage: {
        title: "Moving average",
        description:
          "Uses short- and long-term trend direction for entries and exits.",
      },
      buyAndHold: {
        title: "Buy & Hold",
        description: "Buys the selected assets and holds them through the end.",
      },
    },
  },
  risk: {
    title: "Risk and execution",
    description: "Set position limits and realistic trading assumptions.",
    fields: {
      maxPositionWeight: "Max position weight",
      cashReserve: "Cash reserve",
      stopLoss: "Stop-loss threshold",
      rebalanceFrequency: "Rebalance frequency",
      feeRate: "Trading fee",
      slippageRate: "Slippage",
      executionTiming: "Execution timing",
    },
    hints: {
      maxPositionWeight: "Maximum allocation allowed for one asset",
      cashReserve: "Cash intentionally kept outside the market",
      stopLoss: "Set to 0% to disable the stop-loss rule.",
      executionTiming: "Helps prevent look-ahead bias in the simulation.",
    },
    options: {
      rebalanceFrequencies: [
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Quarterly", value: "quarterly" },
      ],
      executionTimings: [
        { label: "Next session open", value: "nextOpen" },
        { label: "Signal-day close", value: "sameClose" },
      ],
    },
  },
  assets: {
    title: "Simulation assets",
    description: "Choose the assets and starting weights used in the scenario.",
    searchLabel: "Search simulation assets",
    searchPlaceholder: "Search AAPL, NVDA, or a company name",
    noResults: "No more matching assets are available.",
    equalize: "Equal weight",
    remove: "Remove",
    invested: "Invested",
    cash: "Cash",
    target: "Target invested",
    columns: {
      asset: "Asset",
      weight: "Starting weight",
      remove: "Manage",
    },
  },
  action: {
    noticeTitle: "Run a fixture backtest.",
    noticeDescription:
      "The selected assumptions recalculate deterministic sample results without live market data.",
    run: "Run simulation",
    running: "Calculating...",
    completed: "Results updated",
  },
  summary: {
    title: "Performance summary",
    totalReturn: "Total return",
    annualizedReturn: "Annualized return",
    maxDrawdown: "Maximum drawdown",
    sharpeRatio: "Sharpe ratio",
    benchmark: "Benchmark",
    excessReturn: "Excess return",
    riskDetail: "Largest decline from a prior peak",
    winRate: "Win rate",
    trades: " trades",
    fixture: "Fixture result",
  },
  chart: {
    title: "Equity curve and drawdown",
    description:
      "Strategy and benchmark value with declines from prior portfolio peaks",
    fixture: "Fixture time series",
    portfolio: "Selected strategy",
    benchmark: "Benchmark",
    drawdown: "Drawdown",
  },
  comparison: {
    title: "Benchmark comparison",
    description: "Strategy and market baseline over the same period",
    strategy: "Selected strategy",
    benchmark: "Benchmark",
    finalValue: "Final value",
    excessReturn: "Excess return",
    winRate: "Profitable trades",
    trades: "Total trades",
    note: "All results are UI fixtures and do not predict or guarantee future returns.",
  },
  trades: {
    title: "Trade history",
    description: "Sample buys and sells produced by the selected assumptions",
    countSuffix: " trades",
    columns: {
      date: "Date",
      asset: "Asset",
      side: "Side",
      price: "Price",
      quantity: "Quantity",
      fee: "Fee",
      returnRate: "Trade return",
    },
    sides: {
      buy: "Buy",
      sell: "Sell",
    },
  },
  validation: {
    required: "This field is required.",
    number: "Enter a valid number.",
    initialCapital: "Initial capital must be at least 1,000.",
    percentage: "Enter a value between 1% and 100%.",
    stopLoss: "Enter a stop loss between 0% and 50%.",
    cost: "Trading costs must be between 0% and 5%.",
    dateRange: "The end date must be after the start date.",
    allocation:
      "Maximum position weight and cash reserve cannot exceed 100% combined.",
    assetsRequired: "Select at least one asset to simulate.",
    assetWeight:
      "Every asset weight must be above 0% and within the maximum position weight.",
    totalWeight:
      "Asset weights must equal the target invested weight after cash reserve.",
  },
} as const satisfies Messages["backtests"];
