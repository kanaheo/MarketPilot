import { NextResponse } from "next/server";

import { isLocale } from "@/i18n/config";
import { MarketPilotApiError } from "@/lib/server/marketpilot-api";
import { requestPasswordReset } from "@/lib/server/password-auth";

type PasswordResetRequestBody = {
  email?: unknown;
  locale?: unknown;
};

export async function POST(request: Request) {
  let body: PasswordResetRequestBody;

  try {
    body = (await request.json()) as PasswordResetRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid password reset request" },
      { status: 400 },
    );
  }

  if (
    typeof body.email !== "string" ||
    body.email.trim().length === 0 ||
    typeof body.locale !== "string" ||
    !isLocale(body.locale)
  ) {
    return NextResponse.json(
      { error: "Invalid password reset request" },
      { status: 400 },
    );
  }

  try {
    const response = await requestPasswordReset({
      email: body.email.trim(),
      locale: body.locale,
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof MarketPilotApiError) {
      return NextResponse.json(
        { error: "Password reset request failed" },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Password reset request failed" },
      { status: 400 },
    );
  }
}
