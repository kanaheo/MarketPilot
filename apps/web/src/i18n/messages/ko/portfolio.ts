import type { PortfolioMessages } from "@/types/i18n/portfolio";

export const portfolio = {
  header: {
    title: "포트폴리오",
    description: "자산 배분, 보유 종목, 현금 흐름과 위험을 한곳에서 확인하세요.",
  },
  pageState: {
    empty: {
      title: "아직 포트폴리오가 없습니다",
      description:
        "첫 모의투자 포트폴리오를 만들면 현금 활동을 기록할 수 있습니다.",
    },
  },
  createForm: {
    title: "첫 포트폴리오 만들기",
    description:
      "이름, 기준 통화, 초기자금을 입력하면 포트폴리오와 최초 입금 내역이 함께 생성됩니다.",
    fields: {
      name: {
        label: "포트폴리오 이름",
        placeholder: "예: 장기 성장 포트폴리오",
      },
      baseCurrency: {
        label: "기준 통화",
      },
      initialCapital: {
        label: "초기자금",
        placeholder: "10000",
      },
    },
    currencies: [
      { label: "미국 달러 (USD)", value: "USD" },
      { label: "한국 원 (KRW)", value: "KRW" },
      { label: "일본 엔 (JPY)", value: "JPY" },
    ],
    submit: "포트폴리오 생성",
    submitting: "생성 중...",
    success: "포트폴리오를 생성했습니다.",
    errors: {
      unauthorized: "로그인이 필요합니다. 다시 로그인한 뒤 시도해 주세요.",
      invalid: "입력값을 확인해 주세요.",
      conflict: "요청을 처리할 수 없습니다. 입력값을 확인해 주세요.",
      unknown: "포트폴리오를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },
    validation: {
      nameRequired: "포트폴리오 이름을 입력해 주세요.",
      nameLength: "포트폴리오 이름은 120자 이하로 입력해 주세요.",
      currency: "지원하는 통화를 선택해 주세요.",
      initialCapitalRequired: "초기자금을 입력해 주세요.",
      initialCapitalPositive: "초기자금은 0보다 커야 합니다.",
    },
  },
  selector: {
    label: "포트폴리오 선택",
    currentCash: "사용 가능 현금",
    createAnother: "새 포트폴리오 만들기",
  },
  summary: {
    label: "포트폴리오 요약",
    unavailable: "아직 계산할 수 없음",
    cards: {
      totalValue: "총 평가금액",
      availableCash: "사용 가능 현금",
      totalReturn: "총 수익률",
      maxDrawdown: "최대 낙폭",
    },
  },
  valueChart: {
    title: "포트폴리오 가치",
    chartLabel: "포트폴리오 가치와 S&P 500 비교 차트",
    portfolio: "내 포트폴리오",
    benchmark: "S&P 500",
    periodLabel: "포트폴리오 가치 조회 기간",
    periods: [
      { label: "1개월", active: true },
      { label: "3개월", active: false },
      { label: "6개월", active: false },
      { label: "1년", active: false },
    ],
  },
  allocation: {
    title: "자산 배분",
    chartLabel: "자산 배분 도넛 차트",
    totalValue: "총 평가금액",
    items: {
      stocks: "주식",
      etfs: "ETF",
      cash: "현금",
    },
  },
  holdings: {
    title: "보유 종목",
    description: "현재 모의투자 포지션 · 현금 제외",
    shareUnit: "주",
    columns: {
      asset: "자산",
      quantity: "수량",
      averagePrice: "평균 매수가",
      currentPrice: "현재가",
      marketValue: "평가금액",
      returnRate: "수익률",
    },
    empty: {
      title: "보유 종목이 없습니다",
      description: "첫 모의주문이 체결되면 보유 종목이 이곳에 표시됩니다.",
    },
  },
  cashActivity: {
    title: "현금 활동",
    description: "최근 현금 원장 내역",
    balance: "사용 가능 현금",
    items: {
      INITIAL_DEPOSIT: "최초 입금",
      DEPOSIT: "입금",
      WITHDRAWAL: "출금",
      FEE: "수수료",
      DIVIDEND: "배당",
    },
    empty: {
      title: "현금 활동이 없습니다",
      description: "입금과 모의매수 내역이 이곳에 표시됩니다.",
    },
  },
  cashTransactionForm: {
    title: "현금 입출금",
    description: "선택한 포트폴리오의 현금 원장에 입금 또는 출금을 기록합니다.",
    fields: {
      transactionType: {
        label: "거래 유형",
        options: {
          deposit: "입금",
          withdrawal: "출금",
        },
      },
      amount: {
        label: "금액",
        placeholder: "100000",
      },
      note: {
        label: "메모",
        placeholder: "선택 입력",
      },
    },
    submit: "현금 거래 기록",
    submitting: "기록 중...",
    success: "현금 거래를 기록했습니다.",
    errors: {
      unauthorized: "로그인이 필요합니다. 다시 로그인한 뒤 시도해 주세요.",
      invalid: "입력값을 확인해 주세요.",
      conflict: "출금 가능 금액이 부족합니다.",
      notFound: "포트폴리오를 찾을 수 없습니다.",
      unknown: "현금 거래를 기록하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },
    validation: {
      transactionType: "거래 유형을 선택해 주세요.",
      amountRequired: "금액을 입력해 주세요.",
      amountPositive: "금액은 0보다 커야 합니다.",
      noteLength: "메모는 500자 이하로 입력해 주세요.",
    },
  },
  orderForm: {
    title: "모의주문 기록",
    description:
      "선택한 포트폴리오에 시장가 또는 지정가 주문을 대기 상태로 기록합니다.",
    fields: {
      symbol: {
        label: "종목 심볼",
        placeholder: "예: AAPL",
      },
      side: {
        label: "매수/매도",
        options: {
          buy: "매수",
          sell: "매도",
        },
      },
      orderType: {
        label: "주문 유형",
        options: {
          market: "시장가",
          limit: "지정가",
        },
      },
      quantity: {
        label: "수량",
        placeholder: "10",
      },
      limitPrice: {
        label: "지정가",
        placeholder: "시장가는 비워두기",
      },
      decisionEvidence: {
        label: "판단 근거",
        placeholder: "선택 입력",
      },
    },
    submit: "주문 기록",
    submitting: "기록 중...",
    success: "주문을 기록했습니다.",
    errors: {
      unauthorized: "로그인이 필요합니다. 다시 로그인한 뒤 시도해 주세요.",
      invalid: "주문 입력값을 확인해 주세요.",
      notFound: "포트폴리오를 찾을 수 없습니다.",
      unknown: "주문을 기록하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },
    validation: {
      decisionEvidenceLength: "판단 근거는 2000자 이하로 입력해 주세요.",
      limitPricePositive: "지정가는 0보다 커야 합니다.",
      limitPriceRequired: "지정가 주문은 지정가가 필요합니다.",
      marketLimitPrice: "시장가 주문은 지정가를 입력하지 않습니다.",
      orderType: "주문 유형을 선택해 주세요.",
      quantityPositive: "수량은 0보다 커야 합니다.",
      quantityRequired: "수량을 입력해 주세요.",
      side: "매수 또는 매도를 선택해 주세요.",
      symbolFormat: "종목 심볼 형식을 확인해 주세요.",
      symbolRequired: "종목 심볼을 입력해 주세요.",
    },
  },
  orders: {
    title: "최근 주문",
    description: "선택한 포트폴리오의 최근 모의주문 내역",
    columns: {
      symbol: "종목",
      side: "구분",
      type: "유형",
      quantity: "수량",
      price: "가격",
      status: "상태",
      createdAt: "기록일",
    },
    sides: {
      BUY: "매수",
      SELL: "매도",
    },
    types: {
      LIMIT: "지정가",
      MARKET: "시장가",
    },
    statuses: {
      CANCELLED: "취소",
      FILLED: "체결",
      PENDING: "대기",
      REJECTED: "거절",
    },
    marketPrice: "시장가",
    empty: {
      title: "주문이 없습니다",
      description: "첫 모의주문을 기록하면 이곳에 표시됩니다.",
    },
  },
  risk: {
    title: "위험 요약",
    description: "현재 포트폴리오 위험 지표",
    status: {
      good: "양호",
      moderate: "보통",
      measured: "측정값",
    },
    items: {
      diversification: {
        title: "분산 투자",
        description: "주식, ETF 및 현금으로 분산",
      },
      concentration: {
        title: "집중도",
        description: "상위 3개 자산이 71%를 차지",
      },
      volatility: {
        title: "변동성(1년)",
        description: "연환산 포트폴리오 변동성",
      },
    },
  },
} as const satisfies PortfolioMessages;
