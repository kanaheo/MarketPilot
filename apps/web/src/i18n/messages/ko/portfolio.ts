import type { Messages } from "@/types/i18n";

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
} as const satisfies Messages["portfolio"];
