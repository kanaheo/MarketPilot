import type { ReactNode } from "react";

export type Locale = "ko" | "en" | "ja";

export type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export type LanguageSelectorProps = Readonly<{
  ariaLabel: string;
  locale: Locale;
}>;

export type Messages = Readonly<{
  navigation: {
    ariaLabel: string;
    items: {
      dashboard: string;
      portfolio: string;
      markets: string;
      backtests: string;
      data: string;
    };
    settings: string;
  };
  topBar: {
    marketOpen: string;
    marketCloseTime: string;
    notifications: string;
    portfolio: string;
  };
  languageSelector: {
    label: string;
  };
  user: {
    fallbackName: string;
    role: string;
    signOut: string;
  };
  feedback: {
    loading: string;
    retry: string;
    errorTitle: string;
    errorDescription: string;
  };
  auth: {
    languageLabel: string;
    story: {
      ariaLabel: string;
      eyebrow: string;
      title: string;
      description: string;
      previewLabel: string;
      benefits: readonly string[];
      note: string;
    };
    login: {
      title: string;
      description: string;
      emailAction: string;
      switchPrompt: string;
      switchAction: string;
      termsPrefix: string;
      termsSuffix: string;
    };
    signup: {
      title: string;
      description: string;
      emailAction: string;
      switchPrompt: string;
      switchAction: string;
      termsPrefix: string;
      termsSuffix: string;
    };
    providers: {
      google: {
        login: string;
        signup: string;
      };
    };
    email: {
      label: string;
      placeholder: string;
      invalid: string;
    };
    status: {
      connecting: string;
      errorTitle: string;
      errorDescription: string;
      cancelledTitle: string;
      cancelledDescription: string;
      dismiss: string;
    };
    or: string;
    terms: string;
    privacy: string;
    termsSeparator: string;
    trust: {
      secure: string;
      paperOnly: string;
    };
  };
  dashboard: {
    header: {
      greeting: string;
      description: string;
      actions: {
        history: string;
        addFunds: string;
      };
    };
    summary: {
      summaryLabel: string;
      cards: {
        totalValue: {
          label: string;
          detail: string;
        };
        availableCash: {
          label: string;
          detail: string;
          detailAside: string;
        };
        todayProfit: {
          label: string;
          detail: string;
        };
        maxDrawdown: {
          label: string;
          detail: string;
          detailAside: string;
        };
      };
    };
    performance: {
      title: string;
      description: string;
      chartLabel: string;
      portfolio: string;
      benchmark: string;
      periodLabel: string;
      empty: {
        title: string;
        description: string;
      };
      periods: readonly {
        label: string;
        active: boolean;
      }[];
    };
    watchlist: {
      title: string;
      updated: string;
      realtime: string;
      manage: string;
      empty: {
        title: string;
        description: string;
        action: string;
      };
      columns: {
        symbol: string;
        price: string;
        change: string;
        trend: string;
      };
    };
    signals: {
      title: string;
      description: string;
      viewAll: string;
      probability: string;
      disclaimer: string;
      empty: {
        title: string;
        description: string;
      };
      risks: {
        low: string;
        medium: string;
        high: string;
      };
      items: {
        amd: {
          title: string;
          description: string;
        };
        xle: {
          title: string;
          description: string;
        };
        tlt: {
          title: string;
          description: string;
        };
      };
    };
    holdings: {
      title: string;
      description: string;
      viewPortfolio: string;
      viewAll: string;
      shareUnit: string;
      empty: {
        title: string;
        description: string;
        action: string;
      };
      columns: {
        symbol: string;
        quantity: string;
        value: string;
        returnRate: string;
      };
    };
    activity: {
      title: string;
      description: string;
      more: string;
      viewAll: string;
      empty: {
        title: string;
        description: string;
      };
      items: {
        deposit: {
          title: string;
          detail: string;
        };
        nvdaBuy: {
          title: string;
          detail: string;
        };
        amdSell: {
          title: string;
          detail: string;
        };
      };
    };
  };
  portfolio: {
    header: {
      title: string;
      description: string;
    };
    summary: {
      label: string;
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
        depositJune: {
          title: string;
        };
        applePurchase: {
          title: string;
        };
        depositMay: {
          title: string;
        };
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
  };
  markets: {
    header: {
      eyebrow: string;
      title: string;
      description: string;
      dataBadge: string;
    };
    filters: {
      ariaLabel: string;
      searchLabel: string;
      searchPlaceholder: string;
      detailsLabel: string;
      reset: string;
      resultsPrefix: string;
      resultsSuffix: string;
      fixtureNotice: string;
      groups: {
        country: string;
        assetClass: string;
        session: string;
        sector: string;
        exchange: string;
        marketCap: string;
        change: string;
        volume: string;
      };
      options: {
        country: readonly {
          label: string;
          value: MarketCountry;
        }[];
        assetClass: readonly {
          label: string;
          value: MarketAssetClass;
        }[];
        session: readonly {
          label: string;
          value: MarketSession;
        }[];
        sector: readonly FilterMessageOption[];
        exchange: readonly FilterMessageOption[];
        marketCap: readonly FilterMessageOption[];
        change: readonly FilterMessageOption[];
        volume: readonly FilterMessageOption[];
      };
      aiSignals: {
        title: string;
        description: string;
      };
    };
    discovery: {
      title: string;
      description: string;
      updated: string;
      evidence: string;
      counterRisk: string;
      fixtureLabel: string;
      disclaimer: string;
      countries: {
        us: string;
        kr: string;
        jp: string;
      };
      risks: {
        low: string;
        medium: string;
      };
      items: {
        nvda: AiDiscoveryMessage;
        samsung: AiDiscoveryMessage;
        toyota: AiDiscoveryMessage;
      };
      empty: {
        title: string;
        description: string;
      };
    };
    table: {
      title: string;
      resultsPrefix: string;
      resultsSuffix: string;
      sortLabel: string;
      sortOptions: readonly {
        label: string;
        value: MarketSort;
      }[];
      columns: {
        company: string;
        market: string;
        price: string;
        change: string;
        volume: string;
        trend: string;
        aiScore: string;
        watchlist: string;
      };
      countries: {
        us: string;
        kr: string;
        jp: string;
      };
      sessions: {
        open: string;
        closed: string;
      };
      noSignal: string;
      addWatchlist: string;
      removeWatchlist: string;
      empty: {
        title: string;
        description: string;
      };
    };
    pulse: {
      title: string;
      description: string;
      breadthTitle: string;
      advancing: string;
      strongestSector: string;
      averageChange: string;
      unusualVolume: string;
      noUnusualVolume: string;
      shares: string;
      summaryTitle: string;
      updated: string;
      summaries: {
        positive: string;
        mixed: string;
        negative: string;
      };
      evidenceLabel: string;
      evidence: string;
      riskLabel: string;
      risk: string;
      source: string;
      countries: {
        us: string;
        kr: string;
        jp: string;
      };
      sectors: {
        technology: string;
        financials: string;
        industrials: string;
        consumer: string;
        healthcare: string;
      };
      empty: {
        title: string;
        description: string;
      };
    };
  };
  backtests: {
    header: {
      eyebrow: string;
      title: string;
      description: string;
      dataBadge: string;
    };
    setup: {
      title: string;
      description: string;
      fields: {
        startDate: string;
        endDate: string;
        initialCapital: string;
        currency: string;
        benchmark: string;
        strategy: string;
      };
      hints: {
        initialCapital: string;
      };
      options: {
        currencies: readonly {
          label: string;
          value: "USD" | "KRW" | "JPY";
        }[];
        benchmarks: readonly {
          label: string;
          value: "SPY" | "KOSPI" | "NIKKEI225";
        }[];
      };
      strategies: {
        momentum: BacktestStrategyMessage;
        movingAverage: BacktestStrategyMessage;
        buyAndHold: BacktestStrategyMessage;
      };
    };
    risk: {
      title: string;
      description: string;
      fields: {
        maxPositionWeight: string;
        cashReserve: string;
        stopLoss: string;
        rebalanceFrequency: string;
        feeRate: string;
        slippageRate: string;
        executionTiming: string;
      };
      hints: {
        maxPositionWeight: string;
        cashReserve: string;
        stopLoss: string;
        executionTiming: string;
      };
      options: {
        rebalanceFrequencies: readonly {
          label: string;
          value: "weekly" | "monthly" | "quarterly";
        }[];
        executionTimings: readonly {
          label: string;
          value: "nextOpen" | "sameClose";
        }[];
      };
    };
    assets: {
      title: string;
      description: string;
      searchLabel: string;
      searchPlaceholder: string;
      noResults: string;
      equalize: string;
      remove: string;
      invested: string;
      cash: string;
      target: string;
      columns: {
        asset: string;
        weight: string;
        remove: string;
      };
    };
    action: {
      noticeTitle: string;
      noticeDescription: string;
      run: string;
      running: string;
      completed: string;
    };
    summary: {
      title: string;
      totalReturn: string;
      annualizedReturn: string;
      maxDrawdown: string;
      sharpeRatio: string;
      benchmark: string;
      excessReturn: string;
      riskDetail: string;
      winRate: string;
      trades: string;
      fixture: string;
    };
    chart: {
      title: string;
      description: string;
      fixture: string;
      portfolio: string;
      benchmark: string;
      drawdown: string;
    };
    comparison: {
      title: string;
      description: string;
      strategy: string;
      benchmark: string;
      finalValue: string;
      excessReturn: string;
      winRate: string;
      trades: string;
      note: string;
    };
    trades: {
      title: string;
      description: string;
      countSuffix: string;
      columns: {
        date: string;
        asset: string;
        side: string;
        price: string;
        quantity: string;
        fee: string;
        returnRate: string;
      };
      sides: {
        buy: string;
        sell: string;
      };
    };
    validation: {
      required: string;
      number: string;
      initialCapital: string;
      percentage: string;
      stopLoss: string;
      cost: string;
      dateRange: string;
      allocation: string;
      assetsRequired: string;
      assetWeight: string;
      totalWeight: string;
    };
  };
}>;

type FilterMessageOption = Readonly<{
  label: string;
  value: string;
}>;

type MarketCountry = "all" | "us" | "kr" | "jp";
type MarketAssetClass = "all" | "stocks" | "etfs";
type MarketSession = "all" | "open" | "closed";
type MarketSort = "aiScore" | "changeRate" | "name" | "volume";

type AiDiscoveryMessage = Readonly<{
  signal: string;
  evidence: string;
  counterRisk: string;
}>;

type BacktestStrategyMessage = Readonly<{
  title: string;
  description: string;
}>;
