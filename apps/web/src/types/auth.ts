import type { Messages } from "@/types/i18n";
import type { Locale } from "@/types/i18n";

export type AuthMode = "login" | "signup";
export type AuthProvider = "google" | "github" | "email";
export type AuthStatus = "idle" | "loading" | "error" | "cancelled";

export type AuthPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

export type AuthScreenProps = Readonly<{
  googleAuthEnabled: boolean;
  initialMode: AuthMode;
  locale: Locale;
  messages: Messages["auth"];
  status: AuthStatus;
}>;

export type ProviderIconProps = Readonly<{
  size?: number;
}>;
