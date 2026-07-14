import { NextResponse } from "next/server";

import { completePasswordReset } from "@/lib/server/password-auth";

type PasswordResetCompleteBody = {
  token?: unknown;
  newPassword?: unknown;
};

export async function POST(request: Request) {
  let body: PasswordResetCompleteBody;

  try {
    body = (await request.json()) as PasswordResetCompleteBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid password reset completion" },
      { status: 400 },
    );
  }

  if (
    typeof body.token !== "string" ||
    typeof body.newPassword !== "string" ||
    body.token.trim().length === 0 ||
    body.newPassword.length === 0
  ) {
    return NextResponse.json(
      { error: "Invalid password reset completion" },
      { status: 400 },
    );
  }

  try {
    const response = await completePasswordReset({
      newPassword: body.newPassword,
      token: body.token.trim(),
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Password reset completion failed" },
      { status: 400 },
    );
  }
}
