import type { Messages } from "@/types/i18n";

export const backtests = {
  header: {
    eyebrow: "전략 연구실",
    title: "전략 시뮬레이션",
    description: "과거 데이터 조건으로 투자 전략의 성과와 위험을 검증하세요.",
    dataBadge: "Fixture 설정 · 실제 투자 성과 아님",
  },
  setup: {
    title: "시뮬레이션 설정",
    description: "검증할 기간, 자금, 전략과 비교 기준을 선택합니다.",
    fields: {
      startDate: "시작일",
      endDate: "종료일",
      initialCapital: "초기자금",
      currency: "기준 통화",
      benchmark: "벤치마크",
      strategy: "전략 프리셋",
    },
    hints: {
      initialCapital: "입출금 없이 시작하는 기준 금액",
    },
    options: {
      currencies: [
        { label: "미국 달러 (USD)", value: "USD" },
        { label: "한국 원 (KRW)", value: "KRW" },
        { label: "일본 엔 (JPY)", value: "JPY" },
      ],
      benchmarks: [
        { label: "S&P 500 ETF (SPY)", value: "SPY" },
        { label: "코스피 지수", value: "KOSPI" },
        { label: "닛케이 225", value: "NIKKEI225" },
      ],
    },
    strategies: {
      momentum: {
        title: "모멘텀",
        description: "최근 상대 강도가 높은 종목을 정기적으로 교체합니다.",
      },
      movingAverage: {
        title: "이동평균",
        description: "단기·장기 이동평균의 방향으로 진입과 이탈을 결정합니다.",
      },
      buyAndHold: {
        title: "Buy & Hold",
        description: "선택한 자산을 매수한 뒤 기간 종료까지 보유합니다.",
      },
    },
  },
  risk: {
    title: "위험 및 실행 조건",
    description: "포지션 제한과 현실적인 거래 비용을 설정합니다.",
    fields: {
      maxPositionWeight: "최대 종목 비중",
      cashReserve: "현금 보유 비율",
      stopLoss: "손절 기준",
      rebalanceFrequency: "리밸런싱 주기",
      feeRate: "거래 수수료",
      slippageRate: "슬리피지",
      executionTiming: "체결 시점",
    },
    hints: {
      maxPositionWeight: "한 종목에 배분할 수 있는 최대 비중",
      cashReserve: "항상 투자하지 않고 남겨둘 현금",
      stopLoss: "0%로 설정하면 손절 규칙을 사용하지 않습니다.",
      executionTiming: "미래 가격을 미리 사용하는 오류를 방지합니다.",
    },
    options: {
      rebalanceFrequencies: [
        { label: "매주", value: "weekly" },
        { label: "매월", value: "monthly" },
        { label: "분기마다", value: "quarterly" },
      ],
      executionTimings: [
        { label: "다음 거래일 시가", value: "nextOpen" },
        { label: "신호 발생일 종가", value: "sameClose" },
      ],
    },
  },
  action: {
    noticeTitle: "현재 단계는 설정 검증용입니다.",
    noticeDescription:
      "수익률, 차트와 거래 결과는 다음 구현 단계에서 fixture로 연결합니다.",
    run: "설정 검증",
    validating: "검증 중...",
    validated: "설정 검증 완료",
  },
  validation: {
    required: "필수 항목입니다.",
    number: "올바른 숫자를 입력해 주세요.",
    initialCapital: "초기자금은 1,000 이상이어야 합니다.",
    percentage: "1%에서 100% 사이로 입력해 주세요.",
    stopLoss: "손절 기준은 0%에서 50% 사이로 입력해 주세요.",
    cost: "거래 비용은 0%에서 5% 사이로 입력해 주세요.",
    dateRange: "종료일은 시작일보다 이후여야 합니다.",
    allocation: "최대 종목 비중과 현금 비율의 합은 100%를 넘을 수 없습니다.",
  },
} as const satisfies Messages["backtests"];
