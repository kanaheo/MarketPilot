type AuthenticatedUser = {
  id: string;
  auth_provider: string;
  auth_subject: string;
  email: string | null;
  display_name: string | null;
  image_url: string | null;
};

type SyncAuthenticatedUserInput = {
  authProvider: string;
  authSubject: string;
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
};

export async function syncAuthenticatedUser(
  input: SyncAuthenticatedUserInput,
): Promise<AuthenticatedUser> {
  const apiUrl = process.env.MARKETPILOT_API_URL;
  const internalToken = process.env.MARKETPILOT_INTERNAL_API_TOKEN;

  if (!apiUrl || !internalToken) {
    throw new Error("MarketPilot backend authentication is not configured");
  }

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
