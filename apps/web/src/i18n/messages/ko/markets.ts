import type { Messages } from "@/types/i18n";

export const markets = {
  header: {
    eyebrow: "글로벌 종목 탐색",
    title: "시장 탐색",
    description: "미국, 한국, 일본 시장에서 새로운 기회를 탐색하세요.",
    dataBadge: "Fixture 종목군 · 3개 시장",
  },
  filters: {
    ariaLabel: "시장 검색 및 필터",
    searchLabel: "티커 또는 회사 검색",
    searchPlaceholder: "티커 또는 회사명을 검색하세요",
    detailsLabel: "상세 조건",
    reset: "초기화",
    resultsPrefix: "조건에 맞는 종목",
    resultsSuffix: "개",
    fixtureNotice: "Fixture 메타데이터 · 지연 시세는 추후 연결",
    groups: {
      country: "시장",
      assetClass: "자산군",
      session: "장 상태",
      sector: "섹터",
      exchange: "거래소",
      marketCap: "시가총액",
      change: "등락",
      volume: "거래량",
    },
    options: {
      country: [
        { label: "전체 시장", value: "all" },
        { label: "미국", value: "us" },
        { label: "한국", value: "kr" },
        { label: "일본", value: "jp" },
      ],
      assetClass: [
        { label: "전체 자산", value: "all" },
        { label: "주식", value: "stocks" },
        { label: "ETF", value: "etfs" },
      ],
      session: [
        { label: "전체 상태", value: "all" },
        { label: "개장 중", value: "open" },
        { label: "마감", value: "closed" },
      ],
      sector: [
        { label: "전체 섹터", value: "all" },
        { label: "기술", value: "technology" },
        { label: "금융", value: "financials" },
        { label: "산업재", value: "industrials" },
        { label: "소비재", value: "consumer" },
        { label: "헬스케어", value: "healthcare" },
      ],
      exchange: [
        { label: "전체 거래소", value: "all" },
        { label: "NASDAQ", value: "NASDAQ" },
        { label: "NYSE", value: "NYSE" },
        { label: "KOSPI", value: "KOSPI" },
        { label: "KOSDAQ", value: "KOSDAQ" },
        { label: "도쿄증권거래소", value: "TSE" },
      ],
      marketCap: [
        { label: "전체 시가총액", value: "all" },
        { label: "대형주", value: "large" },
        { label: "중형주", value: "mid" },
      ],
      change: [
        { label: "전체 등락", value: "all" },
        { label: "상승 종목", value: "gainers" },
        { label: "하락 종목", value: "losers" },
        { label: "보합권", value: "flat" },
      ],
      volume: [
        { label: "전체 거래량", value: "all" },
        { label: "이상 거래량", value: "high" },
        { label: "일반 거래량", value: "normal" },
      ],
    },
    aiSignals: {
      title: "AI 신호만 보기",
      description: "근거가 포함된 fixture 분석",
    },
  },
  discovery: {
    title: "AI 종목 발견",
    description: "선택한 시장에서 근거와 위험을 함께 살펴보는 아이디어",
    updated: "Fixture 분석 · 10분 전 업데이트",
    evidence: "주목하는 이유",
    counterRisk: "반대 위험",
    fixtureLabel: "Fixture 신호 · 실시간 시세 미연결",
    disclaimer:
      "AI 신호는 투자 조언이 아닙니다. 모의투자 판단 전 근거, 반대 위험과 데이터 시점을 함께 확인하세요.",
    countries: {
      us: "미국",
      kr: "한국",
      jp: "일본",
    },
    risks: {
      low: "위험 낮음",
      medium: "위험 중간",
    },
    items: {
      nvda: {
        signal: "모멘텀 강화",
        evidence: "상대 강도와 이상 거래량이 함께 개선되고 있습니다.",
        counterRisk: "최근 상승으로 밸류에이션 실수의 여유가 줄었습니다.",
      },
      samsung: {
        signal: "반등 구조 형성",
        evidence: "반도체 수요 기대와 거래량이 함께 회복되고 있습니다.",
        counterRisk: "메모리 가격과 외국인 수급의 경기 민감도가 높습니다.",
      },
      toyota: {
        signal: "방어적 강세",
        evidence: "안정적인 현금 창출과 엔화 약세가 회복력을 지지합니다.",
        counterRisk: "환율 반전과 공급 비용이 마진을 낮출 수 있습니다.",
      },
    },
    empty: {
      title: "조건에 맞는 AI 신호가 없습니다",
      description:
        "시장 또는 상세 조건을 넓혀 다른 fixture 신호를 확인해 보세요.",
    },
  },
  table: {
    title: "시장 종목",
    resultsPrefix: "검색 결과",
    resultsSuffix: "개",
    sortLabel: "정렬",
    sortOptions: [
      { label: "AI 점수순", value: "aiScore" },
      { label: "등락률순", value: "changeRate" },
      { label: "거래량순", value: "volume" },
      { label: "회사명순", value: "name" },
    ],
    columns: {
      company: "종목",
      market: "시장",
      price: "현재가",
      change: "등락률",
      volume: "거래량",
      trend: "추이",
      aiScore: "AI 점수",
      watchlist: "관심",
    },
    countries: {
      us: "미국",
      kr: "한국",
      jp: "일본",
    },
    sessions: {
      open: "개장 중",
      closed: "마감",
    },
    noSignal: "—",
    addWatchlist: "관심 종목에 추가",
    removeWatchlist: "관심 종목에서 제거",
    empty: {
      title: "조건에 맞는 종목이 없습니다",
      description:
        "일부 조건을 초기화하거나 다른 티커 또는 회사명을 검색해 보세요.",
    },
  },
  pulse: {
    title: "시장 맥박",
    description: "현재 필터 결과의 흐름을 압축해서 보여줍니다",
    breadthTitle: "시장 확산도",
    advancing: "상승",
    strongestSector: "오늘의 강세 섹터",
    averageChange: "평균",
    unusualVolume: "이상 거래량",
    noUnusualVolume: "이상 거래량 없음",
    shares: "주",
    summaryTitle: "AI 시장 요약",
    updated: "Fixture 분석 · 10분 전 업데이트",
    summaries: {
      positive:
        "현재 결과는 강세 섹터를 중심으로 전반적인 모멘텀이 개선되는 모습입니다.",
      mixed:
        "현재 결과는 혼조세이며, 상승 흐름이 일부 종목에 집중되어 있습니다.",
      negative:
        "일부 상대 강도 종목을 제외하면 현재 결과의 위험 선호가 약해지고 있습니다.",
    },
    evidenceLabel: "판단 근거",
    evidence: "상승 종목 비율, 평균 등락률, 섹터 강도 및 거래량",
    riskLabel: "반대 위험",
    risk: "적은 fixture 표본은 시장의 강세와 약세를 과장할 수 있습니다.",
    source: "출처: MarketPilot fixture 종목군 · 실시간 시장 데이터 아님",
    countries: {
      us: "미국",
      kr: "한국",
      jp: "일본",
    },
    sectors: {
      technology: "기술",
      financials: "금융",
      industrials: "산업재",
      consumer: "소비재",
      healthcare: "헬스케어",
    },
    empty: {
      title: "조건에 맞는 시장 흐름이 없습니다",
      description: "검색 조건을 넓히면 시장 확산도와 주요 흐름을 계산합니다.",
    },
  },
} as const satisfies Messages["markets"];
