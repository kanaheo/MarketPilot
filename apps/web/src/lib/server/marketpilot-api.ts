import { createHmac } from "node:crypto";

import { auth } from "@/auth";

const USER_API_TOKEN_AUDIENCE = "marketpilot-api";
const USER_API_TOKEN_ISSUER = "marketpilot-web";
const USER_API_TOKEN_TTL_SECONDS = 60;

type MarketPilotRequestInit = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

function createUserApiToken(userId: string, signingSecret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    aud: USER_API_TOKEN_AUDIENCE,
    exp: issuedAt + USER_API_TOKEN_TTL_SECONDS,
    iat: issuedAt,
    iss: USER_API_TOKEN_ISSUER,
    sub: userId,
  };
  const payloadSegment = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signatureSegment = createHmac("sha256", signingSecret)
    .update(payloadSegment)
    .digest("base64url");

  return `${payloadSegment}.${signatureSegment}`;
}

export async function marketPilotApiFetch(
  path: `/${string}`,
  init: MarketPilotRequestInit = {},
): Promise<Response> {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("Authentication required");
  }

  const apiUrl = process.env.MARKETPILOT_API_URL;
  const signingSecret = process.env.MARKETPILOT_USER_API_SIGNING_SECRET;
  if (!apiUrl || !signingSecret) {
    throw new Error("MarketPilot user API authentication is not configured");
  }

  const headers = new Headers(init.headers);
  headers.set(
    "Authorization",
    `Bearer ${createUserApiToken(userId, signingSecret)}`,
  );

  return fetch(`${apiUrl}${path}`, {
    ...init,
    cache: init.cache ?? "no-store",
    headers,
  });
}
