import type {
  AuthenticatedUser,
  SyncAuthenticatedUserInput,
} from "@/types/auth";
import { getRequiredServerEnv } from "@/lib/server/env";

export async function syncAuthenticatedUser(
  input: SyncAuthenticatedUserInput,
): Promise<AuthenticatedUser> {
  const apiUrl = getRequiredServerEnv("MARKETPILOT_API_URL");
  const internalToken = getRequiredServerEnv("MARKETPILOT_INTERNAL_API_TOKEN");

  const response = await fetch(`${apiUrl}/internal/auth/users/sync`, {
    body: JSON.stringify({
      auth_provider: input.authProvider,
      auth_subject: input.authSubject,
      display_name: input.displayName,
      email: input.email,
      image_url: input.imageUrl,
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-MarketPilot-Internal-Token": internalToken,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`MarketPilot user sync failed: ${response.status}`);
  }

  return (await response.json()) as AuthenticatedUser;
}
