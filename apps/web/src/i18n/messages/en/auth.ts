import type { Messages } from "@/types/i18n";

export const auth = {
  languageLabel: "Select language",
  story: {
    ariaLabel: "About MarketPilot",
    eyebrow: "A calmer way to practice investing",
    title: "Read the market.\nRecord your reasoning.\nRespect the risk.",
    description:
      "Practice managing a portfolio without real funds and validate your strategies with transparent data.",
    previewLabel: "Portfolio this month",
    benefits: [
      "Practice safely with virtual funds",
      "Track return and maximum drawdown",
      "Review evidence and risk behind AI signals",
    ],
    note: "MarketPilot does not place real orders or guarantee returns.",
  },
  login: {
    title: "Welcome back",
    description: "Continue exploring your portfolio and the market.",
    emailAction: "Continue with email",
    switchPrompt: "New to MarketPilot?",
    switchAction: "Start for free",
    termsPrefix: "By continuing, you agree to our",
    termsSuffix: ".",
  },
  signup: {
    title: "Start your investment journal",
    description:
      "Create an account and get ready to build a safe paper portfolio.",
    emailAction: "Create free account",
    switchPrompt: "Already have an account?",
    switchAction: "Sign in",
    termsPrefix: "By creating an account, you agree to our",
    termsSuffix: ".",
  },
  providers: {
    google: {
      login: "Continue with Google",
      signup: "Sign up with Google",
    },
    github: {
      login: "Continue with GitHub",
      signup: "Sign up with GitHub",
    },
  },
  email: {
    label: "Email",
    placeholder: "name@example.com",
  },
  status: {
    connecting: "Connecting...",
    errorTitle: "We couldn't complete sign-in",
    errorDescription: "Try again in a moment or choose another method.",
    cancelledTitle: "Sign-in was cancelled",
    cancelledDescription:
      "Nothing was saved. You can restart whenever you're ready.",
    dismiss: "Dismiss notification",
  },
  or: "or",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  termsSeparator: " and ",
  trust: {
    secure: "Secure authentication",
    paperOnly: "Paper trading only",
  },
} as const satisfies Messages["auth"];
