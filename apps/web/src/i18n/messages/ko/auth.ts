import type { Messages } from "@/types/i18n";

export const auth = {
  languageLabel: "언어 선택",
  story: {
    ariaLabel: "MarketPilot 소개",
    eyebrow: "더 차분한 투자 연습",
    title: "시장을 읽고,\n근거를 남기고,\n위험을 확인하세요.",
    description:
      "실제 자금 없이 포트폴리오를 운영하고, 전략과 판단을 데이터로 검증하는 모의투자 공간입니다.",
    previewLabel: "이번 달 포트폴리오",
    benefits: [
      "가상자금으로 안전하게 투자 연습",
      "수익률과 최대 낙폭을 한눈에 확인",
      "AI 신호의 근거와 위험을 함께 검토",
    ],
    note: "MarketPilot은 실거래 주문이나 수익 보장을 제공하지 않습니다.",
  },
  login: {
    title: "다시 만나서 반가워요",
    description: "계속해서 포트폴리오와 시장 흐름을 확인하세요.",
    emailAction: "이메일로 계속",
    switchPrompt: "아직 계정이 없나요?",
    switchAction: "무료로 시작하기",
    termsPrefix: "계속하면",
    termsSuffix: "에 동의하게 됩니다.",
  },
  signup: {
    title: "나만의 투자 기록을 시작하세요",
    description:
      "가입과 동시에 안전한 모의 포트폴리오를 만들 준비를 시작합니다.",
    emailAction: "무료 계정 만들기",
    switchPrompt: "이미 계정이 있나요?",
    switchAction: "로그인",
    termsPrefix: "계정을 만들면",
    termsSuffix: "에 동의하게 됩니다.",
  },
  providers: {
    google: {
      login: "Google로 로그인",
      signup: "Google로 가입",
    },
    github: {
      login: "GitHub로 로그인",
      signup: "GitHub로 가입",
    },
  },
  email: {
    label: "이메일",
    placeholder: "name@example.com",
    invalid: "올바른 이메일 주소를 입력해 주세요.",
  },
  status: {
    connecting: "연결 중...",
    errorTitle: "로그인을 완료하지 못했습니다",
    errorDescription: "잠시 후 다시 시도하거나 다른 방법을 선택해 주세요.",
    cancelledTitle: "로그인이 취소되었습니다",
    cancelledDescription:
      "계정 정보는 저장되지 않았습니다. 원할 때 다시 시작할 수 있어요.",
    dismiss: "알림 닫기",
  },
  or: "또는",
  terms: "이용약관",
  privacy: "개인정보 처리방침",
  termsSeparator: "과 ",
  trust: {
    secure: "안전한 인증 흐름",
    paperOnly: "모의투자 전용",
  },
} as const satisfies Messages["auth"];
