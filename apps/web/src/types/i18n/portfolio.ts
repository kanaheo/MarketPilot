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
    };
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
