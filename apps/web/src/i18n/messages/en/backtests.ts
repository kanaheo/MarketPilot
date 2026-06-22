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
  action: {
    noticeTitle: "This stage validates configuration only.",
    noticeDescription:
      "Returns, charts, and trades will use fixture results in the next stage.",
    run: "Validate setup",
    validating: "Validating...",
    validated: "Setup validated",
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
  },
} as const satisfies Messages["backtests"];
