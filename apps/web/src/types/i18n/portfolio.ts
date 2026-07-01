export type PortfolioMessages = Readonly<{
  header: {
    title: string;
    description: string;
  };
  pageState: {
    empty: {
      title: string;
      description: string;
    };
  };
  createForm: {
    title: string;
    description: string;
    fields: {
      name: {
        label: string;
        placeholder: string;
      };
      baseCurrency: {
        label: string;
      };
      initialCapital: {
        label: string;
        placeholder: string;
      };
    };
    currencies: readonly {
      label: string;
      value: "USD" | "KRW" | "JPY";
    }[];
    submit: string;
    submitting: string;
    success: string;
    errors: {
      unauthorized: string;
      invalid: string;
      conflict: string;
      unknown: string;
    };
    validation: {
      nameRequired: string;
      nameLength: string;
      currency: string;
      initialCapitalRequired: string;
      initialCapitalPositive: string;
    };
  };
  selector: {
    label: string;
    currentCash: string;
    createAnother: string;
  };
  summary: {
    label: string;
    unavailable: string;
    cards: {
      totalValue: string;
      availableCash: string;
      totalReturn: string;
      maxDrawdown: string;
    };
  };
  valueChart: {
    title: string;
    chartLabel: string;
    portfolio: string;
    benchmark: string;
    periodLabel: string;
    periods: readonly {
      label: string;
      active: boolean;
    }[];
  };
  allocation: {
    title: string;
    chartLabel: string;
    totalValue: string;
    items: {
      stocks: string;
      etfs: string;
      cash: string;
    };
  };
  holdings: {
    title: string;
    description: string;
    shareUnit: string;
    columns: {
      asset: string;
      quantity: string;
      averagePrice: string;
      currentPrice: string;
      marketValue: string;
      returnRate: string;
    };
    empty: {
      title: string;
      description: string;
    };
  };
  cashActivity: {
    title: string;
    description: string;
    balance: string;
    items: {
      INITIAL_DEPOSIT: string;
      DEPOSIT: string;
      WITHDRAWAL: string;
      FEE: string;
      DIVIDEND: string;
      TRADE_BUY: string;
      TRADE_SELL: string;
    };
    empty: {
      title: string;
      description: string;
    };
  };
  cashTransactionForm: {
    title: string;
    description: string;
    fields: {
      transactionType: {
        label: string;
        options: {
          deposit: string;
          withdrawal: string;
        };
      };
      amount: {
        label: string;
        placeholder: string;
      };
      note: {
        label: string;
        placeholder: string;
      };
    };
    submit: string;
    submitting: string;
    success: string;
    errors: {
      unauthorized: string;
      invalid: string;
      conflict: string;
      notFound: string;
      unknown: string;
    };
    validation: {
      transactionType: string;
      amountRequired: string;
      amountPositive: string;
      noteLength: string;
    };
  };
  orderForm: {
    title: string;
    description: string;
    fields: {
      symbol: {
        label: string;
        placeholder: string;
      };
      side: {
        label: string;
        options: {
          buy: string;
          sell: string;
        };
      };
      orderType: {
        label: string;
        options: {
          market: string;
          limit: string;
        };
      };
      quantity: {
        label: string;
        placeholder: string;
      };
      limitPrice: {
        label: string;
        placeholder: string;
      };
      decisionEvidence: {
        label: string;
        placeholder: string;
      };
    };
    submit: string;
    submitting: string;
    success: string;
    errors: {
      unauthorized: string;
      conflict: string;
      invalid: string;
      notFound: string;
      unknown: string;
    };
    validation: {
      decisionEvidenceLength: string;
      limitPricePositive: string;
      limitPriceRequired: string;
      marketLimitPrice: string;
      orderType: string;
      quantityDecimalPlaces: string;
      quantityPositive: string;
      quantityRequired: string;
      side: string;
      symbolFormat: string;
      symbolRequired: string;
    };
  };
  orders: {
    title: string;
    description: string;
    columns: {
      symbol: string;
      side: string;
      type: string;
      quantity: string;
      price: string;
      status: string;
      createdAt: string;
      actions: string;
    };
    sides: {
      BUY: string;
      SELL: string;
    };
    types: {
      LIMIT: string;
      MARKET: string;
    };
    statuses: {
      CANCELLED: string;
      FILLED: string;
      PENDING: string;
      REJECTED: string;
    };
    marketPrice: string;
    update: string;
    updateQuantityLabel: string;
    updateErrors: {
      unauthorized: string;
      invalid: string;
      conflict: string;
      notFound: string;
      unknown: string;
    };
    execute: string;
    executePriceLabel: string;
    executePricePlaceholder: string;
    executeErrors: {
      unauthorized: string;
      invalid: string;
      conflict: string;
      notFound: string;
      unknown: string;
    };
    cancel: string;
    delete: string;
    empty: {
      title: string;
      description: string;
    };
  };
  risk: {
    title: string;
    description: string;
    status: {
      good: string;
      moderate: string;
      measured: string;
    };
    items: {
      diversification: {
        title: string;
        description: string;
      };
      concentration: {
        title: string;
        description: string;
      };
      volatility: {
        title: string;
        description: string;
      };
    };
  };
}>;
