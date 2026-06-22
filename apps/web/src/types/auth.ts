import type { Messages } from "@/types/i18n";
import type { Locale } from "@/types/i18n";

export type AuthMode = "login" | "signup";
export type AuthProvider = "google" | "email";
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

export type SignOutButtonProps = Readonly<{
  label: string;
  redirectTo: string;
}>;

export type AuthenticatedUser = {
  id: string;
  auth_provider: string;
  auth_subject: string;
  email: string | null;
  display_name: string | null;
  image_url: string | null;
};

export type SyncAuthenticatedUserInput = {
  authProvider: string;
  authSubject: string;
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
};
