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
  };
}>;
