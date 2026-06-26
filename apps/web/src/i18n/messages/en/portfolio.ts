import type { PortfolioMessages } from "@/types/i18n/portfolio";

export const portfolio = {
  header: {
    title: "Portfolio",
    description: "Track allocation, holdings, cash flow, and risk in one place.",
  },
  pageState: {
    empty: {
      title: "No portfolio yet",
      description:
        "Create your first paper portfolio to start recording cash activity.",
    },
  },
  createForm: {
    title: "Create your first portfolio",
    description:
      "Enter a name, base currency, and starting capital to create the portfolio and its initial deposit together.",
    fields: {
      name: {
        label: "Portfolio name",
        placeholder: "Example: Long-term growth portfolio",
      },
      baseCurrency: {
        label: "Base currency",
      },
      initialCapital: {
        label: "Starting capital",
        placeholder: "10000",
      },
    },
    currencies: [
      { label: "US dollar (USD)", value: "USD" },
      { label: "Korean won (KRW)", value: "KRW" },
      { label: "Japanese yen (JPY)", value: "JPY" },
    ],
    submit: "Create portfolio",
    submitting: "Creating...",
    success: "Portfolio created.",
    errors: {
      unauthorized: "Please sign in again before creating a portfolio.",
      invalid: "Please check your inputs.",
      conflict: "The request could not be processed. Please check your inputs.",
      unknown: "Could not create the portfolio. Please try again shortly.",
    },
    validation: {
      nameRequired: "Enter a portfolio name.",
      nameLength: "Portfolio name must be 120 characters or fewer.",
      currency: "Choose a supported currency.",
      initialCapitalRequired: "Enter starting capital.",
      initialCapitalPositive: "Starting capital must be greater than 0.",
    },
  },
  selector: {
    label: "Select portfolio",
    currentCash: "Available cash",
    createAnother: "Create another portfolio",
  },
  summary: {
    label: "Portfolio summary",
    unavailable: "Not available yet",
    cards: {
      totalValue: "Total value",
      availableCash: "Available cash",
      totalReturn: "Total return",
      maxDrawdown: "Max drawdown",
    },
  },
  valueChart: {
    title: "Portfolio value",
    chartLabel: "Portfolio value and S&P 500 comparison chart",
    portfolio: "Your portfolio",
    benchmark: "S&P 500",
    periodLabel: "Portfolio value period",
    periods: [
      { label: "1M", active: true },
      { label: "3M", active: false },
      { label: "6M", active: false },
      { label: "1Y", active: false },
    ],
  },
  allocation: {
    title: "Asset allocation",
    chartLabel: "Asset allocation donut chart",
    totalValue: "Total value",
    items: {
      stocks: "Stocks",
      etfs: "ETFs",
      cash: "Cash",
    },
  },
  holdings: {
    title: "Holdings",
    description: "Current paper positions · cash excluded",
    shareUnit: " sh",
    columns: {
      asset: "Asset",
      quantity: "Quantity",
      averagePrice: "Average price",
      currentPrice: "Current price",
      marketValue: "Market value",
      returnRate: "Return",
    },
    empty: {
      title: "No holdings yet",
      description:
        "Your positions will appear here after your first paper order is filled.",
    },
  },
  cashActivity: {
    title: "Cash activity",
    description: "Recent cash ledger activity",
    balance: "Available cash",
    items: {
      INITIAL_DEPOSIT: "Initial deposit",
      DEPOSIT: "Deposit",
      WITHDRAWAL: "Withdrawal",
      FEE: "Fee",
      DIVIDEND: "Dividend",
      TRADE_BUY: "Buy trade",
      TRADE_SELL: "Sell trade",
    },
    empty: {
      title: "No cash activity yet",
      description: "Deposits and paper purchases will appear here.",
    },
  },
  cashTransactionForm: {
    title: "Cash deposit / withdrawal",
    description:
      "Record a deposit or withdrawal in the selected portfolio cash ledger.",
    fields: {
      transactionType: {
        label: "Transaction type",
        options: {
          deposit: "Deposit",
          withdrawal: "Withdrawal",
        },
      },
      amount: {
        label: "Amount",
        placeholder: "100000",
      },
      note: {
        label: "Note",
        placeholder: "Optional",
      },
    },
    submit: "Record cash transaction",
    submitting: "Recording...",
    success: "Cash transaction recorded.",
    errors: {
      unauthorized: "Please sign in again before recording cash activity.",
      invalid: "Please check your inputs.",
      conflict: "Available cash is not enough for this withdrawal.",
      notFound: "Portfolio not found.",
      unknown: "Could not record the cash transaction. Please try again shortly.",
    },
    validation: {
      transactionType: "Choose a transaction type.",
      amountRequired: "Enter an amount.",
      amountPositive: "Amount must be greater than 0.",
      noteLength: "Note must be 500 characters or fewer.",
    },
  },
  orderForm: {
    title: "Record paper order",
    description:
      "Record a market or limit order for the selected portfolio as pending.",
    fields: {
      symbol: {
        label: "Symbol",
        placeholder: "Example: AAPL",
      },
      side: {
        label: "Side",
        options: {
          buy: "Buy",
          sell: "Sell",
        },
      },
      orderType: {
        label: "Order type",
        options: {
          market: "Market",
          limit: "Limit",
        },
      },
      quantity: {
        label: "Quantity",
        placeholder: "10",
      },
      limitPrice: {
        label: "Limit price",
        placeholder: "Leave blank for market",
      },
      decisionEvidence: {
        label: "Decision evidence",
        placeholder: "Optional",
      },
    },
    submit: "Record order",
    submitting: "Recording...",
    success: "Order recorded.",
    errors: {
      unauthorized: "Please sign in again before recording an order.",
      invalid: "Please check your order inputs.",
      notFound: "Portfolio not found.",
      unknown: "Could not record the order. Please try again shortly.",
    },
    validation: {
      decisionEvidenceLength:
        "Decision evidence must be 2000 characters or fewer.",
      limitPricePositive: "Limit price must be greater than 0.",
      limitPriceRequired: "Limit orders require a limit price.",
      marketLimitPrice: "Market orders must not include a limit price.",
      orderType: "Choose an order type.",
      quantityPositive: "Quantity must be greater than 0.",
      quantityRequired: "Enter a quantity.",
      side: "Choose buy or sell.",
      symbolFormat: "Check the symbol format.",
      symbolRequired: "Enter a symbol.",
    },
  },
  orders: {
    title: "Recent orders",
    description: "Recent paper orders for the selected portfolio",
    columns: {
      symbol: "Symbol",
      side: "Side",
      type: "Type",
      quantity: "Quantity",
      price: "Price",
      status: "Status",
      createdAt: "Recorded",
      actions: "Action",
    },
    sides: {
      BUY: "Buy",
      SELL: "Sell",
    },
    types: {
      LIMIT: "Limit",
      MARKET: "Market",
    },
    statuses: {
      CANCELLED: "Cancelled",
      FILLED: "Filled",
      PENDING: "Pending",
      REJECTED: "Rejected",
    },
    marketPrice: "Market",
    execute: "Fill",
    executePriceLabel: "Execution price",
    executePricePlaceholder: "Price",
    executeErrors: {
      unauthorized: "Please sign in again before filling an order.",
      invalid: "Check the execution price.",
      conflict:
        "Could not fill the order. Check cash, position quantity, or order status.",
      notFound: "Order not found.",
      unknown: "Could not fill the order. Please try again shortly.",
    },
    cancel: "Cancel",
    empty: {
      title: "No orders yet",
      description: "Your first paper order will appear here.",
    },
  },
  risk: {
    title: "Risk overview",
    description: "Current portfolio risk indicators",
    status: {
      good: "Good",
      moderate: "Moderate",
      measured: "Measured",
    },
    items: {
      diversification: {
        title: "Diversification",
        description: "Spread across stocks, ETFs, and cash",
      },
      concentration: {
        title: "Concentration",
        description: "Top three holdings represent 71%",
      },
      volatility: {
        title: "Volatility (1Y)",
        description: "Annualized portfolio volatility",
      },
    },
  },
} as const satisfies PortfolioMessages;
