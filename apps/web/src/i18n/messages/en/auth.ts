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
    forgotPassword: "Forgot password?",
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
  },
  email: {
    label: "Email",
    placeholder: "name@example.com",
    invalid: "Enter a valid email address.",
  },
  password: {
    label: "Password",
    placeholder: "At least 12 characters",
    invalid:
      "Use at least 12 characters with uppercase, lowercase, number, and special character.",
  },
  status: {
    connecting: "Connecting...",
    errorTitle: "We couldn't complete sign-in",
    errorDescription: "Try again in a moment or choose another method.",
    cancelledTitle: "Sign-in was cancelled",
    cancelledDescription:
      "Nothing was saved. You can restart whenever you're ready.",
    duplicateTitle: "This email is already registered",
    duplicateDescription:
      "If you signed up with Google, use Google sign-in on the login screen.",
    verificationTitle: "Email verification required",
    verificationDescription:
      "Your account was created. Verify your email before signing in.",
    devVerificationLink: "Open development verification link",
    dismiss: "Dismiss notification",
  },
  verifyEmail: {
    successTitle: "Email verified",
    successDescription: "You can now sign in with your email and password.",
    errorTitle: "We couldn't verify your email",
    errorDescription: "The verification link may be expired or already used.",
    loginAction: "Go to sign in",
  },
  resetPassword: {
    requestTitle: "Reset your password",
    requestDescription: "Enter your account email to prepare reset instructions.",
    requestAction: "Request reset link",
    requestSuccessTitle: "Request received",
    requestSuccessDescription:
      "If an account exists, password reset instructions are available.",
    devResetLink: "Open development reset link",
    completeTitle: "Set a new password",
    completeDescription: "Enter a new password to protect your account.",
    completeAction: "Change password",
    completeSuccessTitle: "Password changed",
    completeSuccessDescription: "You can now sign in with your new password.",
    invalidTokenTitle: "Reset link is invalid",
    invalidTokenDescription: "The link may be expired or already used.",
    loginAction: "Go to sign in",
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
