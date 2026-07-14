import { NextResponse } from "next/server";

import { requestPasswordReset } from "@/lib/server/password-auth";

type PasswordResetRequestBody = {
  email?: unknown;
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

  if (typeof body.email !== "string" || body.email.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid password reset request" },
      { status: 400 },
    );
  }

  try {
    const response = await requestPasswordReset({ email: body.email.trim() });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Password reset request failed" },
      { status: 400 },
    );
  }
}
