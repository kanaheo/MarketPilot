import type {
  AuthenticatedUser,
  PasswordSignupResponse,
} from "@/types/auth";
import { getRequiredServerEnv } from "@/lib/server/env";

type PasswordSignupInput = {
  email: string;
  password: string;
};

type PasswordVerifyInput = {
  email: string;
  password: string;
};

type AuthActionResponse = {
  message: string;
  dev_token: string | null;
};

type PasswordResetRequestInput = {
  email: string;
};

type PasswordResetCompleteInput = {
  token: string;
  newPassword: string;
};

export async function signupWithPassword(
  input: PasswordSignupInput,
): Promise<PasswordSignupResponse> {
  const apiUrl = getRequiredServerEnv("MARKETPILOT_API_URL");
  const response = await fetch(`${apiUrl}/auth/password/signup`, {
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`MarketPilot password signup failed: ${response.status}`);
  }

  return (await response.json()) as PasswordSignupResponse;
}

export async function verifyPasswordCredentials(
  input: PasswordVerifyInput,
): Promise<AuthenticatedUser | null> {
  const apiUrl = getRequiredServerEnv("MARKETPILOT_API_URL");
  const response = await fetch(`${apiUrl}/auth/password/verify`, {
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `MarketPilot password verification failed: ${response.status}`,
    );
  }

  return (await response.json()) as AuthenticatedUser;
}

export async function confirmEmailVerification(
  token: string,
): Promise<AuthActionResponse> {
  const apiUrl = getRequiredServerEnv("MARKETPILOT_API_URL");
  const response = await fetch(
    `${apiUrl}/auth/password/email-verification/confirm`,
    {
      body: JSON.stringify({ token }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(`Email verification failed: ${response.status}`);
  }

  return (await response.json()) as AuthActionResponse;
}

export async function requestPasswordReset(
  input: PasswordResetRequestInput,
): Promise<AuthActionResponse> {
  const apiUrl = getRequiredServerEnv("MARKETPILOT_API_URL");
  const response = await fetch(`${apiUrl}/auth/password/password-reset/request`, {
    body: JSON.stringify({ email: input.email }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Password reset request failed: ${response.status}`);
  }

  return (await response.json()) as AuthActionResponse;
}

export async function completePasswordReset(
  input: PasswordResetCompleteInput,
): Promise<AuthActionResponse> {
  const apiUrl = getRequiredServerEnv("MARKETPILOT_API_URL");
  const response = await fetch(`${apiUrl}/auth/password/password-reset/complete`, {
    body: JSON.stringify({
      new_password: input.newPassword,
      token: input.token,
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Password reset completion failed: ${response.status}`);
  }

  return (await response.json()) as AuthActionResponse;
}
